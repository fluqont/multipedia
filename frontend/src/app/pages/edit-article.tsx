import classes from "./new-article.module.css";
import { Editor } from "@toast-ui/react-editor";
import { FormEvent, lazy, Suspense, useEffect, useRef } from "react";
import Form from "../../ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMutation, fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import { useParams } from "wouter";
import ErrorPage from "../../ui/error-page";
import { useCurrentUser } from "../../lib/context-as-hooks";
import Tips from "../../components/tips";
import { getFriends } from "../../lib/get-friends";
import Pfp from "../../components/pfp";
import { Article } from "../../types/article";
const CustomEditor = lazy(() => import("../../components/custom-editor"));

export default function EditArticle() {
  const { username, topic } = useParams();
  const query = qs.stringify({
    fields: ["body", "draft"],
    populate: {
      shared: {
        fields: ["id"],
      },
    },
    filters: {
      user: {
        username: {
          $eq: username,
        },
      },
      topic: {
        title: {
          $eq: topic,
        },
      },
    },
  });
  const editorRef = useRef<Editor>(null);

  const { data, status, error } = useQuery({
    queryKey: ["get-article"],
    queryFn: () =>
      fetchQuery(`/articles?${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      }),
  });

  useEffect(() => {
    if (data && "data" in data) {
      editorRef.current?.getInstance().setMarkdown(data.data[0].body);
    }
  }, [data]);

  const { currentUser } = useCurrentUser();

  const {
    status: updateStatus,
    error: updateError,
    mutate: update,
  } = useMutation({
    mutationFn: ({
      documentId,
      body,
    }: {
      documentId: string;
      body: string;
      oldBody: string;
    }) =>
      fetchMutation("PUT", `/articles/${documentId}`, {
        data: { body: body },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["get-article"] }),
  });

  const {
    status: publishStatus,
    error: publishError,
    mutate: publish,
  } = useMutation({
    mutationFn: ({
      article,
      newStatus,
    }: {
      article: Article;
      newStatus: boolean;
    }) =>
      fetchMutation("PUT", `/articles/${article.documentId}`, {
        data: {
          draft: newStatus,
          views: article.views,
        },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["get-article"] }),
  });

  const {
    data: shareData,
    status: shareStatus,
    error: shareError,
    mutate: share,
  } = useMutation({
    mutationFn: ({
      article,
      shared,
    }: {
      article: Article;
      shared: { id: number }[];
    }) =>
      fetchMutation("PUT", `/articles/${article.documentId}`, {
        data: { shared: shared, views: article.views, draft: article.draft },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["get-article"] }),
  });

  const queryClient = useQueryClient();

  const dialogRef = useRef<HTMLDialogElement>(null);

  switch (status) {
    case "pending":
      return <p>loading...</p>;
    case "error":
      return <ErrorPage error={error.name}>{error.message}</ErrorPage>;
    case "success": {
      if ("error" in data) {
        return (
          <ErrorPage error={data.error.status}>{data.error.message}</ErrorPage>
        );
      }

      if (data.data.length === 0) {
        return <ErrorPage error={404}>Article not found</ErrorPage>;
      }

      const { friends } = getFriends(
        currentUser?.outcoming,
        currentUser?.incoming
      );

      const article: Article & { shared: { id: number }[] } = data.data[0];

      function handleUpdate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const body = editorRef.current?.getInstance().getMarkdown();
        update({
          documentId: article.documentId,
          body: body,
          oldBody: article.body,
        });
      }

      function handlePublish() {
        publish({
          article: article,
          newStatus: !article.draft,
        });
        queryClient.invalidateQueries({
          queryKey: ["get-article"],
        });
      }

      return (
        <>
          <Form
            className={classes.form}
            submitLabel="update"
            loading={updateStatus === "pending"}
            error={updateError?.message}
            onSubmit={handleUpdate}
            additionalButtons={
              <>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={publishStatus === "pending"}
                >
                  {article.draft ? "publish" : "unpublish"}
                </button>
                <button
                  type="button"
                  onClick={() => dialogRef.current?.showModal()}
                  disabled={article.draft === false}
                >
                  share draft
                </button>
              </>
            }
          >
            <Suspense>
              <CustomEditor ref={editorRef} initialValue={article.body} />
            </Suspense>
            <Tips />
          </Form>
          {publishStatus === "error" && <p>{publishError.message}</p>}
          <dialog ref={dialogRef}>
            {friends.length > 0 ? (
              <ul>
                {friends.map((friend) => (
                  <li key={friend.id} className={classes.friend}>
                    <div className={classes.profile}>
                      <Pfp pfp={friend.pfp} size={32} />
                      {friend.username}
                    </div>
                    <button
                      disabled={
                        shareStatus === "pending" ||
                        article.shared.findIndex(
                          (user) => user.id === friend.id
                        ) !== -1
                      }
                      onClick={() =>
                        share({
                          article: article,
                          shared: [...article.shared, { id: friend.id }],
                        })
                      }
                    >
                      share
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>nothing</i>
              </p>
            )}
            {shareStatus === "error" && <p>{shareError.message}</p>}
            {shareStatus === "success" && "error" in shareData && (
              <p>{shareData.error.message}</p>
            )}
            <form method="dialog">
              <button>continue</button>
            </form>
          </dialog>
        </>
      );
    }
  }
}
