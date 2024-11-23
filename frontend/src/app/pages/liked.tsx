import { useQuery } from "@tanstack/react-query";
import { fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import ErrorPage from "../../ui/error-page";
import { Article } from "../../types/article";
import ArticleCard from "../../components/article-card";
import classes from "./articles.module.css";
import { useCurrentUser } from "../../lib/context-as-hooks";

export default function Liked() {
  const { currentUser } = useCurrentUser();
  const query = qs.stringify({
    fields: ["draft", "views"],
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
      likes: {
        user: {
          id: {
            $in: [currentUser?.id],
          },
        },
      },
    },
  });

  const { data, status, error } = useQuery({
    queryKey: ["liked-articles"],
    queryFn: () => fetchQuery(`/articles?${query}`),
    enabled: !!currentUser,
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
