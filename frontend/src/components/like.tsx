import qs from "qs";
import { fetchMutation, fetchQuery } from "../lib/fetch-data";
import { useCurrentUser } from "../lib/context-as-hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import atomics from "../atomics.module.css";

interface LikeProps {
  documentId: string;
  isArticleFetched: boolean;
  action: boolean;
}

export default function Like({
  documentId,
  isArticleFetched,
  action,
}: LikeProps) {
  const { currentUser } = useCurrentUser();
  function getLikes() {
    const likesQuery = qs.stringify({
      count: {
        filters: {
          article: {
            documentId: {
              $eq: documentId,
            },
          },
        },
      },
      user: {
        filters: {
          user: {
            documentId: {
              $eq: currentUser?.documentId,
            },
          },
        },
      },
    });
    const jwt = localStorage.getItem("jwt");
    return fetchQuery(`/likes/count?${likesQuery}`, {
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
  }
  const {
    data: likesData,
    status: likesStatus,
    error: likesError,
  } = useQuery({
    queryKey: ["article-likes", documentId],
    queryFn: getLikes,
    enabled: isArticleFetched && !!documentId,
  });

  const queryClient = useQueryClient();

  const {
    data: likeData,
    status: likeStatus,
    error: likeError,
    mutate: like,
  } = useMutation({
    mutationKey: ["like"],
    mutationFn: (articleId: string) => {
      return fetchMutation("POST", "/likes/update", {
        articleId: articleId,
        userId: currentUser?.documentId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["article-likes", documentId],
      });
    },
  });

  const Element = action ? "button" : "div";

  return (
    <>
      <Element
        aria-label="like"
        className={atomics["icon-button"]}
        disabled={!currentUser || likeStatus === "pending"}
        onClick={() => action && like(documentId)}
      >
        {likesData?.liked ? (
          <img src="/like-filled.svg" alt="" />
        ) : (
          <img src="/like.svg" alt="" />
        )}
        {likesStatus === "pending" && "loading"}
        {likesStatus === "success" && likesData.count}
      </Element>
      {likesStatus === "error" && <p>{likesError.message}</p>}
      {likesData && "error" in likesData && <p>{likesData.error.message}</p>}
      {likeStatus === "error" && <p>{likeError.message}</p>}
      {likeData && "error" in likeData && <p>{likeData.error.message}</p>}
    </>
  );
}
