import { useQuery } from "@tanstack/react-query";
import { fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import { useParams } from "wouter";
import ErrorPage from "../../ui/error-page";
import Markdown from "react-markdown";
import classes from "./article.module.css";
import remarkGfm from "remark-gfm";

export default function Article() {
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

  console.log(data);

  switch (status) {
    case "error":
      return <ErrorPage error={error.name}>{error.message}</ErrorPage>;
    case "pending":
      return <p>loading...</p>;
    case "success":
      if ("error" in data) {
        console.log(data);
        return (
          <ErrorPage error={data.error.status}>{data.error.message}</ErrorPage>
        );
      } else {
        return (
          <div className={classes.article}>
            <h1>{data.data[0].topic.title}</h1>
            <Markdown
              components={{ h1: "h2", h2: "h3", h3: "h4", h4: "h5", h5: "h6" }}
              remarkPlugins={[remarkGfm]}
            >
              {data.data[0].body}
            </Markdown>
          </div>
        );
      }
  }
}
