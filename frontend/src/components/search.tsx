import {
  ChangeEvent,
  FormEvent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import classes from "./search.module.css";
import { Link, useLocation } from "wouter";
import useComponentVisible from "../hooks/use-component-visible";
import atomics from "../atomics.module.css";
import Pfp from "./pfp";
import { getArticlesBySearch, getUsersBySearch } from "../api/get-by-search";
import { cn } from "../lib/utils";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "../ui/error-page";
import { MinimalUser } from "../types/user";
import { FetchError } from "../types/fetch";
import { FullArticle } from "../types/article";

export default function Search() {
  const [searchValue, setSearchValue] = useState("");

  const [resultsNeedUpdate, setUpdateResults] = useState(false);
  const [waitingForUpdate, setWaitingForUpdate] = useState(false);

  const timeoutRef = useRef<number>();
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const currValue = e.currentTarget.value;
    setSearchValue(currValue);

    clearTimeout(timeoutRef.current);
    setWaitingForUpdate(true);
    timeoutRef.current = setTimeout(() => {
      setUpdateResults(true);
      setWaitingForUpdate(false);
    }, 1000);
  }

  const { data, status, error, refetch } = useQuery({
    queryKey: ["search-preview"],
    queryFn: () =>
      Promise.all([
        getUsersBySearch(searchValue, false, true),
        getArticlesBySearch(searchValue, true),
      ]),
    enabled: resultsNeedUpdate,
  });

  useEffect(() => {
    if (resultsNeedUpdate === true && searchValue !== "") {
      setUpdateResults(false);
      refetch();
    }
  }, [resultsNeedUpdate]);

  const { ref, isComponentVisible } = useComponentVisible();

  const searchUrl = `/search?q=${searchValue}`;
  const [, setLocation] = useLocation();
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchValue("");
    setLocation(searchUrl);
  }

  return (
    <search className={classes.search} ref={ref}>
      <form className={classes["search-form"]} onSubmit={handleSubmit}>
        <section
          className={cn([
            classes["search-input-wrapper"],
            searchValue && classes["search-active"],
          ])}
        >
          <img src="/search.svg" alt="" width={24} height={24} />
          <input
            onChange={handleChange}
            value={searchValue}
            type="search"
            id="search"
            name="search"
            placeholder="search Multipedia"
            className={classes["search-input"]}
          />
        </section>
        <div className={classes["absolute-wrapper"]}>
          <section
            className={classes.results}
            hidden={
              status === "pending" ||
              waitingForUpdate ||
              !searchValue ||
              !isComponentVisible
            }
          >
            {status === "error" && <p>{error.message}</p>}
            {status === "success" && (
              <>
                <SearchResults label="USERS" results={data[0]}>
                  <Users users={data[0]} setSearchValue={setSearchValue} />
                </SearchResults>
                <SearchResults label="ARTICLES" results={data[1]}>
                  <Articles
                    articles={data[1].data}
                    setSearchValue={setSearchValue}
                  />
                </SearchResults>
              </>
            )}
            <Link href={searchUrl}>Search {searchValue}</Link>
          </section>
        </div>
        <button
          type="submit"
          className={classes["mobile-search-button"]}
          aria-label="go to search page"
        >
          <img src="/search.svg" alt="" width={24} height={24} />
        </button>
      </form>
    </search>
  );
}

interface UsersProps {
  users: MinimalUser[];
  setSearchValue: (searchValue: string) => void;
}

function Users({ users, setSearchValue }: UsersProps) {
  return (
    <>
      {users.length > 0 ? (
        users.map((user) => (
          <li key={user.id}>
            <Link
              href={`/users/${user.username}`}
              className={cn([classes.result, classes.user])}
              onClick={() => setSearchValue("")}
            >
              <Pfp size={48} pfp={user.pfp} />
              {user.username}
            </Link>
          </li>
        ))
      ) : (
        <p>
          <i>nothing</i>
        </p>
      )}
    </>
  );
}

interface ArticlesProps {
  articles: FullArticle[];
  setSearchValue: (searchValue: string) => void;
}

function Articles({ articles, setSearchValue }: ArticlesProps) {
  return (
    <>
      {articles.length > 0 ? (
        articles.map(
          (article) =>
            !article.draft && (
              <li key={article.id}>
                <Link
                  href={`/users/${article.user.username}`}
                  className={cn([classes.result, classes.article])}
                  onClick={() => setSearchValue("")}
                >
                  <p>{article.topic.title}</p>
                  <p className={classes.username}>{article.user.username}</p>
                </Link>
              </li>
            )
        )
      ) : (
        <p>
          <i>nothing</i>
        </p>
      )}
    </>
  );
}

interface SearchResultsProps extends PropsWithChildren {
  label: string;
  results: MinimalUser[] | FetchError;
}

function SearchResults({ label, results, children }: SearchResultsProps) {
  if ("error" in results) {
    return <ErrorPage error={results.errorCode}>{results.error}</ErrorPage>;
  }

  return (
    <figure>
      <h3 className={atomics.h3}>{label}</h3>
      <figcaption>
        <ul className={classes["results-list"]} aria-live="polite">
          {children}
        </ul>
      </figcaption>
    </figure>
  );
}
