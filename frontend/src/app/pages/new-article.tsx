import classes from "./new-article.module.css";
import { Editor } from "@toast-ui/react-editor";
import SearchableSelect from "../../ui/searchable-select";
import { FormEvent, lazy, Suspense, useRef, useState } from "react";
import { ZodError } from "../../types/fetch";
import { useCurrentUser } from "../../lib/context-as-hooks";
import ErrorPage from "../../ui/error-page";
import { Topic } from "../../types/article";
import Form from "../../ui/form";
import { validateData } from "../../lib/utils";
import Tips from "../../components/tips";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMutation, fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import Card from "../../ui/card";
import { Link, useLocation } from "wouter";
import { z } from "zod";
const CustomEditor = lazy(() => import("../../components/custom-editor"));

export default function NewArticle() {
  const {
    data: topics,
    status: topicsStatus,
    error: topicsError,
  } = useQuery({
    queryKey: ["get-topics"],
    queryFn: () => fetchQuery("/topics"),
  });

  const editorRef = useRef<Editor>(null);

  const { currentUser } = useCurrentUser();

  const [searchValue, setSearchValue] = useState("");

  const {
    data: article,
    status: articleStatus,
    error: articleError,
    mutate: refetchArticle,
  } = useMutation({
    mutationKey: ["get-old-article"],
    mutationFn: ({
      searchValue,
      userId,
    }: {
      searchValue: string;
      userId?: number;
    }) => fetchQuery(`/articles?${getQuery(searchValue, userId)}`),
  });

  const [createdArticle, setCreatedArticle] = useState<false | string>(false);

  const [zodErrors, setZodErrors] = useState<null | ZodError["zodErrors"]>(
    null
  );

  const queryClient = useQueryClient();

  async function createTopic(title: string) {
    const validation = validateData({ title }, schemaRegister);
    if (!validation.success) {
      setZodErrors(validation.error);
      throw new Error();
    }

    const createdTopic = topics.data.find(
      (topic: Topic) => topic.title === searchValue
    );
    if (createdTopic) {
      return createdTopic.id;
    }

    return fetchMutation("POST", "/topics", {
      data: { title: validation.data.title },
    });
  }
  const {
    status: newTopicStatus,
    error: newTopicError,
    mutate: newTopic,
  } = useMutation({
    mutationKey: ["create-topic"],
    mutationFn: createTopic,
    onSuccess: async (newTopic) => {
      const json = typeof newTopic !== "number" && (await newTopic.json());
      queryClient.invalidateQueries({ queryKey: ["get-topics"] });
      newArticle(json ? json.data.id : newTopic);
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setLocation] = useLocation();

  const {
    status: newArticleStatus,
    error: newArticleError,
    mutate: newArticle,
  } = useMutation({
    mutationKey: ["create-article"],
    mutationFn: (topicId: number) => {
      return fetchMutation("POST", "/articles", {
        data: {
          body: editorRef.current?.getInstance().getMarkdown(),
          topic: { id: topicId },
          user: { id: currentUser?.id },
        },
      });
    },
    onSuccess: () => {
      setLocation(
        `/users/${currentUser?.username}/articles/${searchValue}/edit`
      );
    },
  });

  switch (topicsStatus) {
    case "pending":
      return <p>loading...</p>;
    case "error":
      return (
        <ErrorPage error={topicsError.name}>{topicsError.message}</ErrorPage>
      );
    case "success": {
      if ("error" in topics) {
        return (
          <ErrorPage error={topics.error.status}>
            {topics.error.message}
          </ErrorPage>
        );
      }

      if (article && "error" in article) {
        return (
          <ErrorPage error={article.error.status}>
            {article.error.message}
          </ErrorPage>
        );
      }

      if (articleStatus === "success") {
        if (article.data.length !== 0 && createdArticle === false) {
          setCreatedArticle(article.data[0].topic.title);
        } else if (article.data.length === 0 && createdArticle !== false) {
          setCreatedArticle(false);
        }
      }

      function handleTopicSelect() {
        setSearchValue((searchValue) => {
          refetchArticle({
            searchValue: searchValue,
            userId: currentUser?.id,
          });
          return searchValue;
        });
      }

      function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        newTopic(searchValue);
      }

      return (
        <>
          <Form
            className={classes.form}
            loading={
              createdArticle !== false ||
              newTopicStatus === "pending" ||
              newArticleStatus === "pending"
            }
            error={
              articleError?.message ||
              newTopicError?.message ||
              newArticleError?.message
            }
            submitLabel="save to account"
            onSubmit={handleSubmit}
          >
            {createdArticle && (
              <Card label="article already exists" type="error">
                <Link
                  href={`/users/${currentUser?.username}/articles/${createdArticle}/edit`}
                >
                  edit
                </Link>
              </Card>
            )}
            <SearchableSelect
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              id="topic"
              dropdownItems={topics.data}
              error={zodErrors?.title}
              handleSelect={handleTopicSelect}
            />
            <Suspense>
              <CustomEditor ref={editorRef} initialValue=" " />
            </Suspense>
            <Tips />
          </Form>
        </>
      );
    }
  }
}

const schemaRegister = z.object({
  title: z.string().min(2).max(255, {
    message: "Topic title must be between 2 and 20 characters",
  }),
});

function getQuery(title: string, userId?: number) {
  const query = qs.stringify({
    fields: ["draft"],
    populate: {
      topic: {
        fields: ["title"],
      },
    },
    filters: {
      topic: {
        title: {
          $eq: title,
        },
      },
      user: {
        id: {
          $eq: userId,
        },
      },
    },
  });
  return query;
}
