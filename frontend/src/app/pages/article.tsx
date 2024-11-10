import { useQuery } from "@tanstack/react-query";
import { fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import { useParams } from "wouter";
import ErrorPage from "../../ui/error-page";
import Markdown from "react-markdown";
import classes from "./article.module.css";

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

  switch (status) {
    case "error":
      return <ErrorPage error={error.name}>{error.message}</ErrorPage>;
    case "pending":
      return <p>loading...</p>;
    case "success":
      return (
        <Markdown className={classes.article}>{data.data[0].body}</Markdown>
      );
  }
}
