import { useQuery } from "@tanstack/react-query";
import { fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import { useParams } from "wouter";
import ErrorPage from "../../ui/error-page";
import Markdown from "react-markdown";
import classes from "./article.module.css";
import remarkGfm from "remark-gfm";
import { useCurrentUser } from "../../lib/context-as-hooks";

export default function Article() {
  const { currentUser } = useCurrentUser();
  const { username, topic } = useParams();
  const query = qs.stringify({
    fields: ["draft", "body"],
    populate: {
      topic: {
        fields: ["title"],
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
      );
    }
  }
}
