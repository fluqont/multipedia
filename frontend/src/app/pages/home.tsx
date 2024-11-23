import { useQuery } from "@tanstack/react-query";
import { fetchQuery } from "../../lib/fetch-data";
import qs from "qs";
import atomics from "../../atomics.module.css";
import { FullArticle, Topic } from "../../types/article";
import ArticleCard from "../../components/article-card";
import classes from "./home.module.css";
import Card from "../../ui/card";
import { useCurrentUser } from "../../lib/context-as-hooks";
import { getFriends } from "../../lib/get-friends";
import { Link } from "wouter";

export default function Home() {
  const { currentUser } = useCurrentUser();

  const {
    data: articles,
    status: articlesStatus,
    error: articlesError,
  } = useQuery({
    queryKey: ["most-viewed-articles"],
    queryFn: () => fetchQuery(`/articles?${articlesQuery}`),
  });

  const {
    data: topics,
    status: topicsStatus,
    error: topicsError,
  } = useQuery({
    queryKey: ["most-viewed-topics"],
    queryFn: () => fetchQuery(`/topics/viewed`),
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

  function getArticlesByFriends() {
    const { friends } = getFriends(
      currentUser?.outcoming,
      currentUser?.incoming
    );
    const query = qs.stringify({
      pagination: {
        limit: 4,
      },
      sort: ["views:desc"],
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
        shared: {
          fields: ["username"],
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
            shared: {
              id: {
                $in: [currentUser?.id],
              },
            },
          },
        ],
        user: {
          documentId: {
            $in: friends.map((user) => user.documentId),
          },
        },
      },
    });
    if (friends.length === 0) {
      return Promise.resolve({ data: [] });
    }
    return fetchQuery(`/articles?${query}`);
  }

  const {
    data: friendArticles,
    status: friendArticlesStatus,
    error: friendArticlesError,
  } = useQuery({
    queryKey: ["articles-by-friend"],
    queryFn: getArticlesByFriends,
    enabled: !!currentUser,
  });

  console.log(friendArticles);

  return (
    <div className={classes.home}>
      {currentUser && (
        <section>
          <h3 className={atomics.h3}>by friends</h3>
          {friendArticlesStatus === "pending" && (
            <p>
              <i>loading...</i>
            </p>
          )}
          {friendArticlesStatus === "error" && (
            <p>{friendArticlesError.message}</p>
          )}
          {friendArticlesStatus === "success" &&
            ("error" in friendArticles ? (
              <p>{friendArticles.error.message}</p>
            ) : friendArticles.data.length > 0 ? (
              <ul className={classes.articles}>
                {friendArticles.data.map((article: FullArticle) => (
                  <li key={article.id}>
                    <ArticleCard article={article} />
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>nothing</i>
              </p>
            ))}
        </section>
      )}
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
          ) : articles.data.length > 0 ? (
            <>
              <ul className={classes.articles}>
                {articles.data.map((article: FullArticle) => (
                  <li key={article.id}>
                    <ArticleCard article={article} />
                  </li>
                ))}
              </ul>
              <Link
                href="/articles/by-views?page=1"
                className={atomics["link-button"]}
              >
                more
              </Link>
            </>
          ) : (
            <p>
              <i>nothing</i>
            </p>
          ))}
      </section>
      <section>
        <h3 className={atomics.h3}>most popular topics</h3>
        {topicsStatus === "pending" && (
          <p>
            <i>loading...</i>
          </p>
        )}
        {topicsStatus === "error" && <p>{topicsError.message}</p>}
        {topicsStatus === "success" &&
          ("error" in topics ? (
            <p>{topics.error.message}</p>
          ) : (
            <ul className={classes.articles}>
              {topics.map((topic: Topic) => (
                <li key={topic.id}>
                  <Link href={`/articles/${topic.title}`}>
                    <Card label={topic.title} />
                  </Link>
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
          ) : "documentId" in randomArticle ? (
            <ArticleCard className={classes.random} article={randomArticle} />
          ) : (
            <p>
              <i>nothing</i>
            </p>
          ))}
      </section>
    </div>
  );
}

const articlesQuery = qs.stringify({
  pagination: {
    limit: 4,
  },
  sort: ["views:desc"],
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
    draft: {
      $eq: false,
    },
  },
});
