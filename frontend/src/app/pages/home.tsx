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

  const {
    data: randomArticle,
    status: articleStatus,
    error: articleError,
    refetch,
  } = useQuery({
    queryKey: ["random-article"],
    queryFn: () => fetchQuery("/articles/random"),
  });

  return (
    <div className={classes.home}>
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
      <section>
        <div className={classes.header}>
          <h3 className={atomics.h3}>random article</h3>
          <button
            disabled={articleStatus === "pending"}
            onClick={() => refetch()}
          >
            roll
          </button>
        </div>
        {articleStatus === "pending" && (
          <p>
            <i>loading...</i>
          </p>
        )}
        {articleStatus === "error" && <p>{articleError.message}</p>}
        {articleStatus === "success" &&
          ("error" in randomArticle ? (
            <p>{randomArticle.error.message}</p>
          ) : (
            <ArticleCard className={classes.random} article={randomArticle} />
          ))}
      </section>
    </div>
  );
}

const query = qs.stringify({
  pagination: {
    limit: 4,
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
