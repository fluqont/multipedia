import qs from "qs";
import { fetchMutation, fetchQuery } from "../lib/fetch-data";
import { useCurrentUser } from "../lib/context-as-hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import atomics from "../atomics.module.css";

interface LikeProps {
  documentId: string;
  isArticleFetched: boolean;
}

export default function Like({ documentId, isArticleFetched }: LikeProps) {
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
    return fetchQuery(`/likes/count?${likesQuery}`);
  }
  const {
    data: likesData,
    status: likesStatus,
    error: likesError,
  } = useQuery({
    queryKey: ["article-likes"],
    queryFn: getLikes,
    enabled: isArticleFetched,
  });

  const queryClient = useQueryClient();

  const {
    data: likeData,
    status: likeStatus,
    error: likeError,
    mutate: like,
  } = useMutation({
    mutationKey: ["like"],
    mutationFn: (articleId: string) =>
      fetchMutation("POST", "/likes/update", {
        articleId: articleId,
        userId: currentUser?.documentId,
      }),
    onSuccess: async (data) => {
      queryClient.setQueryData(["article-likes"], await data.json());
    },
  });

  return (
    <>
      <button
        aria-label="like"
        className={atomics["icon-button"]}
        disabled={likeStatus === "pending"}
        onClick={() => like(documentId)}
      >
        {likesData?.liked ? (
          <img src="/like-filled.svg" alt="" />
        ) : (
          <img src="/like.svg" alt="" />
        )}
        {likesStatus === "pending" && "loading"}
        {likesStatus === "success" && likesData.count}
      </button>
      {likesStatus === "error" && <p>{likesError.message}</p>}
      {likesData && "error" in likesData && <p>{likesData.error.message}</p>}
      {likeStatus === "error" && <p>{likeError.message}</p>}
      {likeData && "error" in likeData && <p>{likeData.error.message}</p>}
    </>
  );
}
