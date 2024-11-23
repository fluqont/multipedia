import classes from "./new-article.module.css";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { FormEvent, useEffect, useRef } from "react";
import Form from "../../ui/form";
import { getColorScheme } from "../../lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMutation, fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import { useParams } from "wouter";
import ErrorPage from "../../ui/error-page";
import { Article } from "../../types/article";
import { useCurrentUser } from "../../lib/context-as-hooks";
import Tips from "../../components/tips";
import { getFriends } from "../../lib/get-friends";
import Pfp from "../../components/pfp";

export default function EditArticle() {
  const { username, topic } = useParams();
  const query = qs.stringify({
    fields: ["body", "draft"],
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

  const timeoutRef = useRef<number>();
  function handleChange() {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      localStorage.setItem(
        "body",
        editorRef.current?.getInstance().getMarkdown()
      );
    }, 1000);
  }

  const { data, status, error } = useQuery({
    queryKey: ["get-article"],
    queryFn: () => fetchQuery(`/articles?${query}`),
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
    mutationKey: ["update-article"],
    mutationFn: ({ documentId, body }: { documentId: string; body: string }) =>
      fetchMutation("PUT", `/articles/${documentId}`, {
        data: { body: body },
        userId: currentUser?.id,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["get-article"] }),
  });

  const {
    status: publishStatus,
    error: publishError,
    mutate: publish,
  } = useMutation({
    mutationKey: ["publish-article"],
    mutationFn: ({
      documentId,
      newStatus,
    }: {
      documentId: string;
      newStatus: boolean;
    }) =>
      fetchMutation("PUT", `/articles/${documentId}`, {
        data: {
          draft: newStatus,
        },
        userId: currentUser?.id,
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

      const article: Article = data.data[0];

      function handleUpdate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const body = editorRef.current?.getInstance().getMarkdown();
        update({ documentId: article.documentId, body: body });
      }

      function handlePublish() {
        publish({
          documentId: article.documentId,
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
                <dialog ref={dialogRef}>
                  {friends.length > 0 ? (
                    <ul>
                      {friends.map((friend) => (
                        <li key={friend.id} className={classes.friend}>
                          <div className={classes.profile}>
                            <Pfp pfp={friend.pfp} size={32} />
                            {friend.username}
                          </div>
                          <button>share</button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      <i>nothing</i>
                    </p>
                  )}
                  <form method="dialog">
                    <button>continue</button>
                  </form>
                </dialog>
              </>
            }
          >
            <Editor
              previewStyle="tab"
              theme={getColorScheme()}
              hideModeSwitch={true}
              onChange={handleChange}
              ref={editorRef}
              initialValue={article.body}
            />
            <Tips />
          </Form>
          {publishStatus === "error" && <p>{publishError.message}</p>}
        </>
      );
    }
  }
}
