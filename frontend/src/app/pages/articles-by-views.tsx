import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import classes from "./articles-by-views.module.css";
import ErrorPage from "../../ui/error-page";
import { Article } from "../../types/article";
import ArticleCard from "../../components/article-card";
import Pagination from "../../ui/pagination";

export default function ArticlesByViews() {
  const params = new URLSearchParams(useSearch());
  const page = Number(params.get("page"));
  const query = qs.stringify({
    pagination: {
      page: page,
      pageSize: 10,
    },
    sort: ["views:desc"],
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
      draft: {
        $eq: false,
      },
    },
  });
  const { data, status, error } = useQuery({
    queryKey: ["articles-by-views", page],
    queryFn: () => fetchQuery(`/articles?${query}`),
  });
  console.log(data);
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
          <>
            <ol className={classes.articles}>
              {data.data.map((article: Article) => (
                <li key={article.documentId} className={classes.article}>
                  <ArticleCard article={article} />
                </li>
              ))}
            </ol>
            <Pagination
              url="/articles/by-views"
              end={data.meta.pagination.pageCount}
            />
          </>
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
