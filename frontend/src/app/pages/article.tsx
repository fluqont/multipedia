import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchMutation, fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import { Link, useLocation, useParams } from "wouter";
import ErrorPage from "../../ui/error-page";
import classes from "./article.module.css";
import { useCurrentUser } from "../../lib/context-as-hooks";
import Pfp from "../../components/pfp";
import { useState } from "react";
import Comments from "../../components/comments";
import ArticleStats from "../../components/article-stats";
import { type Article } from "../../types/article";
import CustomMarkdown from "../../components/custom-markdown";
import markdownClasses from "../../components/custom-markdown.module.css";

export default function Article() {
  const { currentUser } = useCurrentUser();
  const { username, topic } = useParams();
  function getArticle() {
    const query = qs.stringify({
      fields: ["draft", "body", "views"],
      populate: {
        topic: {
          fields: ["title"],
        },
        user: {
          fields: ["username"],
          populate: {
            pfp: {
              fields: ["url"],
            },
          },
        },
      },
      filters: {
        $or: [
          {
            draft: {
              $eq: false,
            },
          },
          {
            user: {
              username: {
                $eq: currentUser?.username,
              },
            },
          },
          {
            shared: {
              id: {
                $in: [currentUser?.id],
              },
            },
          },
        ],
        topic: {
          title: {
            $eq: topic,
          },
        },
        user: {
          username: {
            $eq: username,
          },
        },
      },
    });
    return fetchQuery(`/articles?${query}`);
  }
  const { data, status, error } = useQuery({
    queryKey: ["article", username, topic],
    queryFn: getArticle,
  });

  const [isArticleFetched, setArticleFetched] = useState(false);

  if (!isArticleFetched && status === "success" && !("error" in data)) {
    setArticleFetched(true);
  }

  const [, setLocation] = useLocation();
  const {
    data: copyData,
    status: copyStatus,
    error: copyError,
    mutate: copy,
  } = useMutation({
    mutationFn: ({ article }: { article: Article }) =>
      fetchMutation("POST", "/articles", {
        data: {
          body: article.body,
          user: { id: currentUser?.id },
          topic: { id: article.topic.id },
        },
      }),
    onSuccess: (_, variables) =>
      setLocation(
        `/users/${currentUser?.username}/articles/${variables.article.topic.title}/edit`
      ),
  });

  switch (status) {
    case "error":
      return <ErrorPage error={error.name}>{error.message}</ErrorPage>;
    case "pending":
      return <p>loading...</p>;
    case "success": {
      if ("error" in data) {
        return (
          <ErrorPage error={data.error.status}>{data.error.message}</ErrorPage>
        );
      }

      const article = data.data[0];
      if (!article) {
        return <ErrorPage error={404}>Not found</ErrorPage>;
      }
      return (
        <div className={classes.wrapper}>
          <Link
            href={`/users/${article.user.username}`}
            className={classes["user-profile"]}
          >
            <Pfp size={48} pfp={article.user.pfp} />
            {article.user.username}
          </Link>
          <div className={markdownClasses.markdown}>
            <h1>{article.topic.title}</h1>
            <CustomMarkdown>{article.body}</CustomMarkdown>
          </div>
          <ArticleStats article={article} isArticleFetched={isArticleFetched} />
          {currentUser && currentUser.id !== article.user.id && (
            <button
              disabled={copyStatus === "pending"}
              className={classes.copy}
              onClick={() => copy({ article: article })}
            >
              clone article
            </button>
          )}
          {copyStatus === "error" && <p>{copyError.message}</p>}
          {copyData && "error" in copyData && <p>{copyData.error.message}</p>}
          <Comments id={article.id} isArticleFetched={isArticleFetched} />
        </div>
      );
    }
  }
}
