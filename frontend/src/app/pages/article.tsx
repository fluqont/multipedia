import { useQuery } from "@tanstack/react-query";
import { fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import { Link, useParams } from "wouter";
import ErrorPage from "../../ui/error-page";
import Markdown from "react-markdown";
import classes from "./article.module.css";
import remarkGfm from "remark-gfm";
import { useCurrentUser } from "../../lib/context-as-hooks";
import Pfp from "../../components/pfp";
import { useState } from "react";
import Comments from "../../components/comments";
import ArticleStats from "../../components/article-stats";

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
    queryKey: ["article", currentUser],
    queryFn: getArticle,
  });

  console.log(data);

  const [isArticleFetched, setArticleFetched] = useState(false);

  if (!isArticleFetched && status === "success" && !("error" in data)) {
    setArticleFetched(true);
  }

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
          <div className={classes.article}>
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
          </div>
          <ArticleStats article={article} isArticleFetched={isArticleFetched} />
          <Comments id={article.id} isArticleFetched={isArticleFetched} />
        </div>
      );
    }
  }
}
