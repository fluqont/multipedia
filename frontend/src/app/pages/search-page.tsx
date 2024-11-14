import { FormEvent, PropsWithChildren, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import classes from "./search-page.module.css";
import atomics from "../../atomics.module.css";
import UserProfile from "../../components/user-profile";
import { MinimalUser } from "../../types/user";
import { getArticlesBySearch, getUsersBySearch } from "../../api/get-by-search";
import InputField from "../../ui/input-field";
import Form from "../../ui/form";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "../../ui/error-page";
import { FullArticle } from "../../types/article";
import Card from "../../ui/card";
import Pfp from "../../components/pfp";

export default function SearchPage() {
  const searchValue = useSearch().split("q=")[1];
  const { data, status, error, refetch } = useQuery({
    queryKey: ["search-page"],
    queryFn: () =>
      Promise.all([
        getUsersBySearch(searchValue, false),
        getArticlesBySearch(searchValue),
      ]),
  });

  useEffect(() => {
    refetch();
  }, [searchValue]);

  const [, setLocation] = useLocation();

  function handleMobileSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const search = new FormData(e.currentTarget).get("search");
    setLocation(`/search?q=${search}`);
  }

  switch (status) {
    case "error":
      return <ErrorPage error={error.name}>{error.message}</ErrorPage>;
    case "pending":
      return <p>loading...</p>;
    case "success":
      console.log(data);
      return (
        <>
          <Form
            className={classes["mobile-search"]}
            onSubmit={handleMobileSubmit}
            loading={false}
          >
            <InputField id="search" />
          </Form>
          <SearchResults label="users">
            {data[0].length > 0 ? (
              data[0].map((user: MinimalUser) => (
                <Link href={`/users/${user.username}`} key={user.id}>
                  <UserProfile
                    user={user}
                    showEditButton={false}
                    size="small"
                  />
                </Link>
              ))
            ) : (
              <p>
                <i>nothing</i>
              </p>
            )}
          </SearchResults>
          <SearchResults label="articles">
            {data[1].data.length > 0 ? (
              data[1].data.map(
                (article: FullArticle) =>
                  !article.draft && (
                    <Card
                      key={article.id}
                      title={
                        <Link
                          href={`/users/${article.user.username}/articles/${article.topic.title}`}
                          className={classes.result}
                        >
                          {article.topic.title}
                        </Link>
                      }
                    >
                      <Link
                        href={`/users/${article.user.username}`}
                        className={classes["user-profile"]}
                      >
                        <Pfp size={48} pfp={article.user.pfp} />
                        {article.user.username}
                      </Link>
                    </Card>
                  )
              )
            ) : (
              <p>
                <i>nothing</i>
              </p>
            )}
          </SearchResults>
        </>
      );
  }
}

interface SearchResultsProps extends PropsWithChildren {
  label: string;
}

function SearchResults({ label, children }: SearchResultsProps) {
  return (
    <figure className={classes["search-page-wrapper"]}>
      <h3 className={atomics.h3}>{label}</h3>
      <figcaption>
        <ul className={classes.results}>{children}</ul>
      </figcaption>
    </figure>
  );
}
