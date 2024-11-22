import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import ErrorPage from "../../ui/error-page";
import { Article } from "../../types/article";
import ArticleCard from "../../components/article-card";
import classes from "./articles.module.css";

export default function Articles() {
  const { topic } = useParams();

  const query = qs.stringify({
    fields: ["views"],
    populate: {
      user: {
        fields: ["username"],
        populate: {
          pfp: {
            fields: ["url"],
          },
        },
      },
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
      draft: {
        $eq: false,
      },
    },
  });

  const { data, status, error } = useQuery({
    queryKey: ["articles-by-topic", topic],
    queryFn: () => fetchQuery(`/articles?${query}`),
  });

  switch (status) {
    case "pending":
      return <p>loading...</p>;
    case "error":
      return <ErrorPage error={error.name}>{error.message}</ErrorPage>;
    case "success":
      if ("error" in data) {
        return (
          <ErrorPage error={data.error.status}>{data.error.message}</ErrorPage>
        );
      }

      if (data.data.length > 0) {
        return (
          <ul className={classes.articles}>
            {data.data.map((article: Article) => (
              <li key={article.documentId}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        );
      } else {
        return (
          <p>
            <i>nothing</i>
          </p>
        );
      }
  }
}
