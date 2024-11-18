import {
  ChangeEvent,
  FormEvent,
  HTMLAttributes,
  PropsWithChildren,
  useState,
} from "react";
import { Link, useLocation, useSearch } from "wouter";
import classes from "./search-page.module.css";
import UserProfile from "../../components/user-profile";
import { MinimalUser } from "../../types/user";
import { getArticlesBySearch, getUsersBySearch } from "../../api/get-by-search";
import InputField from "../../ui/input-field";
import Form from "../../ui/form";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ErrorPage from "../../ui/error-page";
import { FullArticle } from "../../types/article";
import Card from "../../ui/card";
import Pfp from "../../components/pfp";
import Toggle from "../../ui/toggle";
import Pagination from "../../ui/pagination";

export default function SearchPage() {
  const params = new URLSearchParams(useSearch());
  const searchValue = params.get("q");
  const page = Number(params.get("page"));
  const { data, status, error } = useQuery({
    queryKey: ["search-page", searchValue, page],
    queryFn: () =>
      Promise.all([
        getUsersBySearch(searchValue!, false, false),
        getArticlesBySearch(searchValue!, false, page),
      ]),
    placeholderData: keepPreviousData,
  });

  const [, setLocation] = useLocation();

  function handleMobileSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const search = new FormData(e.currentTarget).get("search");
    setLocation(`/search?q=${search}&page=${page}`);
  }

  const [resultsType, setResultsType] = useState<"users" | "articles">("users");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setResultsType(e.currentTarget.value as typeof resultsType);
  }

  switch (status) {
    case "error":
      return <ErrorPage error={error.name}>{error.message}</ErrorPage>;
    case "pending":
      return <p>loading...</p>;
    case "success":
      return (
        <>
          <div className={classes["toggle-wrapper"]}>
            <Toggle
              id="users"
              type="radio"
              name="results-type"
              checked={resultsType === "users"}
              onChange={handleChange}
            >
              users
            </Toggle>
            <Toggle
              id="articles"
              type="radio"
              name="results-type"
              checked={resultsType === "articles"}
              onChange={handleChange}
            >
              articles
            </Toggle>
          </div>
          <Form
            className={classes["mobile-search"]}
            onSubmit={handleMobileSubmit}
            loading={false}
          >
            <InputField id="search" />
          </Form>
          <SearchResults hidden={resultsType !== "users"}>
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
          <SearchResults hidden={resultsType !== "articles"}>
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
            <Pagination end={data[1]?.meta.pagination.pageCount} />
          </SearchResults>
        </>
      );
  }
}

function SearchResults({
  children,
  ...props
}: PropsWithChildren & HTMLAttributes<HTMLElement>) {
  return (
    <ul className={classes.results} {...props}>
      {children}
    </ul>
  );
}
