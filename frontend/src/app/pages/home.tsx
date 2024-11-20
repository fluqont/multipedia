import { useQuery } from "@tanstack/react-query";
import { fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import atomics from "../../atomics.module.css";
import { FullArticle } from "../../types/article";
import ArticleCard from "../../components/article-card";
import classes from "./home.module.css";

export default function Home() {
  const {
    data: articles,
    status: articlesStatus,
    error: articlesError,
  } = useQuery({
    queryKey: ["most-viewed-articles"],
    queryFn: () => fetchQuery(`/articles?${query}`),
  });
  return (
    <section>
      <h3 className={atomics.h3}>most popular articles</h3>
      {articlesStatus === "pending" && (
        <p>
          <i>loading...</i>
        </p>
      )}
      {articlesStatus === "error" && <p>{articlesError.message}</p>}
      {articlesStatus === "success" &&
        ("error" in articles ? (
          <p>{articles.error.message}</p>
        ) : (
          <ul className={classes.articles}>
            {articles.data.map((article: FullArticle) => (
              <li key={article.id}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}

const query = qs.stringify({
  pagination: {
    limit: 4,
  },
  sort: ["views"],
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
