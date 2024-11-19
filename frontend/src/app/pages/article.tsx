import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMutation, fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import { Link, useParams } from "wouter";
import ErrorPage from "../../ui/error-page";
import Markdown from "react-markdown";
import classes from "./article.module.css";
import atomics from "../../atomics.module.css";
import remarkGfm from "remark-gfm";
import { useCurrentUser } from "../../lib/context-as-hooks";
import Pfp from "../../components/pfp";
import { useState } from "react";

export default function Article() {
  const { currentUser } = useCurrentUser();
  const { username, topic } = useParams();
  const query = qs.stringify({
    fields: ["draft", "body"],
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
  const { data, status, error } = useQuery({
    queryKey: ["article"],
    queryFn: () => fetchQuery(`/articles?${query}`),
  });

  const [fetchLikes, setFetchLikes] = useState(false);

  if (!fetchLikes && status === "success" && !("error" in data)) {
    setFetchLikes(true);
  }

  function getLikes() {
    const likesQuery = qs.stringify({
      count: {
        filters: {
          article: {
            documentId: {
              $eq: data.data[0].documentId,
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
    queryKey: ["article-likes", fetchLikes],
    queryFn: getLikes,
    enabled: fetchLikes,
  });

  const queryClient = useQueryClient();

  const {
    data: likeData,
    status: likeStatus,
    error: likeError,
    mutate: like,
  } = useMutation({
    mutationKey: ["like"],
    mutationFn: (articleId: number) =>
      fetchMutation("POST", "/likes/update", {
        articleId: articleId,
        userId: currentUser?.documentId,
      }),
    onSuccess: async (data) => {
      queryClient.setQueryData(
        ["article-likes", fetchLikes],
        await data.json()
      );
    },
  });

  console.log(likesData);

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
      if (
        article.draft === true &&
        (!currentUser || username !== currentUser.username)
      ) {
        return <ErrorPage error={403}>Forbidden</ErrorPage>;
      }
      return (
        <div className={classes.article}>
          <Link
            href={`/users/${article.user.username}`}
            className={classes["user-profile"]}
          >
            <Pfp size={48} pfp={article.user.pfp} />
            {article.user.username}
          </Link>
          <h1>{article.topic.title}</h1>
          <Markdown
            components={{
              h1: "h2",
              h2: "h3",
              h3: "h4",
              h4: "h5",
              h5: "h6",
            }}
            remarkPlugins={[remarkGfm]}
          >
            {article.body}
          </Markdown>
          <button
            aria-label="like"
            className={atomics["icon-button"]}
            disabled={likeStatus === "pending"}
            onClick={() => like(article.documentId)}
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
          {likesData && "error" in likesData && (
            <p>{likesData.error.message}</p>
          )}
          {likeStatus === "error" && <p>{likeError.message}</p>}
          {likeData && "error" in likeData && <p>{likeData.error.message}</p>}
        </div>
      );
    }
  }
}
