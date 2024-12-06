import {
  MutationStatus,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Form from "../ui/form";
import TextareaField from "../ui/textarea-field";
import { FormEvent, memo, useState } from "react";
import { fetchMutation, fetchQuery } from "../lib/fetch-data";
import qs from "qs";
import { ZodError } from "../types/fetch";
import { useCurrentUser } from "../lib/context-as-hooks";
import { validateData } from "../lib/utils";
import { z } from "zod";
import { type Comment } from "../types/article";
import classes from "./comments.module.css";
import Pfp from "./pfp";
import { Link } from "wouter";
import CustomMarkdown from "./custom-markdown";

interface CommentsProps {
  id: number;
  isArticleFetched: boolean;
}

const schemaRegister = z.object({
  comment: z.string().min(1).max(255),
});

export default function Comments({ id, isArticleFetched }: CommentsProps) {
  const { currentUser } = useCurrentUser();

  const queryClient = useQueryClient();

  function getComments() {
    const commentsQuery = qs.stringify({
      fields: ["body", "markdown"],
      populate: {
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
        article: {
          id: {
            $eq: id,
          },
        },
      },
    });
    return fetchQuery(`/comments?${commentsQuery}`);
  }

  const {
    data: comments,
    status: commentsStatus,
    error: commentsError,
  } = useQuery({
    queryKey: ["get-comments"],
    queryFn: getComments,
    enabled: isArticleFetched,
  });

  const [zodErrors, setZodErrors] = useState<null | ZodError["zodErrors"]>(
    null
  );

  const {
    mutate: comment,
    status: commentStatus,
    error: commentError,
  } = useMutation({
    mutationKey: ["submit-comment"],
    mutationFn: ({
      body,
      articleId,
      markdown,
    }: {
      body: string;
      articleId: number;
      markdown?: boolean;
    }) =>
      fetchMutation("POST", "/comments", {
        data: {
          body: body,
          user: { id: currentUser?.id },
          article: { id: articleId },
          markdown: markdown,
        },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["get-comments"] }),
  });

  const [commentValue, setCommentValue] = useState("");

  function handleComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCommentValue("");

    const formData = new FormData(e.currentTarget);

    const validation = validateData(formData, schemaRegister);
    if (!validation.success) {
      setZodErrors(validation.error);
      return;
    }

    setZodErrors(null);
    comment({
      body: validation.data.comment,
      articleId: id,
      markdown: formData.get("markdown") === "on",
    });
  }

  const {
    data,
    status: deleteStatus,
    error: deleteError,
    mutate: deleteComment,
  } = useMutation({
    mutationKey: ["delete-comment"],
    mutationFn: (documentId: string) =>
      fetchMutation("DELETE", `/comments/${documentId}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["get-comments"] }),
  });

  return (
    <div className={classes.wrapper}>
      <Form
        loading={commentStatus === "pending"}
        error={commentError?.message}
        onSubmit={handleComment}
      >
        <TextareaField
          id="comment"
          maxLength={255}
          rows={3}
          className={classes["comment-field"]}
          error={zodErrors?.comment}
          onChange={(e) => setCommentValue(e.currentTarget.value)}
          value={commentValue}
        />
        <div className={classes["enable-markdown"]}>
          <input type="checkbox" id="markdown" name="markdown" />
          <label htmlFor="markdown">enable markdown</label>
        </div>
      </Form>
      {commentsStatus === "success" && !("error" in comments) && (
        <>
          {deleteStatus === "error" && <p>{deleteError.message}</p>}
          {deleteStatus === "success" && "error" in data && (
            <p>{data.error.message}</p>
          )}
          <ul className={classes.comments}>
            {comments.data.map((comment: Comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                deleteComment={deleteComment}
                deleteStatus={deleteStatus}
              />
            ))}
          </ul>
        </>
      )}
      {commentsStatus === "error" && <p>{commentsError.message}</p>}
      {comments && "error" in comments && <p>{comments.error.message}</p>}
    </div>
  );
}

interface CommentProps {
  comment: Comment;
  deleteComment: (documentId: string) => void;
  deleteStatus: MutationStatus;
}

const Comment = memo(
  ({ comment, deleteComment, deleteStatus }: CommentProps) => {
    const { currentUser } = useCurrentUser();

    return (
      <li className={classes.comment}>
        <Link href={`/users/${comment.user.username}`}>
          <Pfp pfp={comment.user.pfp} size={48} />
        </Link>
        <div className={classes.info}>
          <Link
            href={`/users/${comment.user.username}`}
            className={classes.username}
          >
            {comment.user.username}
          </Link>
          {comment.markdown === true ? (
            <CustomMarkdown>{comment.body}</CustomMarkdown>
          ) : (
            <p>{comment.body}</p>
          )}
        </div>
        {currentUser?.documentId === comment.user.documentId && (
          <button
            className={classes.delete}
            disabled={deleteStatus === "pending"}
            onClick={() => deleteComment(comment.documentId)}
          >
            delete
          </button>
        )}
      </li>
    );
  }
);
