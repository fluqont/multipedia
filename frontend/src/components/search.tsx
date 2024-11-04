import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import classes from "./search.module.css";
import { Link, useLocation } from "wouter";
import useComponentVisible from "../hooks/use-component-visible";
import atomics from "../atomics.module.css";
import Pfp from "./pfp";
import { User } from "../types/user";
import { getUsersBySearch } from "../api/get-users-by-search";
import { cn } from "../lib/cn";

export default function Search() {
  const [searchValue, setSearchValue] = useState("");

  const [resultsNeedUpdate, setUpdateResults] = useState(false);

  const timeoutRef = useRef<number>();
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const currValue = e.currentTarget.value;
    setSearchValue(currValue);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setUpdateResults(true);
    }, 1000);
  }

  const [searchResults, setSearchResults] = useState<null | User[]>(null);
  useEffect(() => {
    async function asyncFetch() {
      const users = await getUsersBySearch(searchValue, false);
      setSearchResults(users);
    }

    if (resultsNeedUpdate && searchValue) {
      asyncFetch();
      setUpdateResults(false);
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
        <section className={classes.results}>
          <figure
            className={classes["results-list-wrapper"]}
            hidden={!searchValue || !isComponentVisible}
          >
            <h3 className={atomics.h3}>USERS</h3>
            <figcaption>
              <ul className={classes["results-list"]}>
                {searchResults &&
                  searchResults.map((user) => (
                    <li key={user.id}>
                      <Link
                        href={`/users/${user.username}`}
                        className={classes.result}
                        onClick={() => setSearchValue("")}
                      >
                        <Pfp size={48} pfp={user.pfp} />
                        {user.username}
                      </Link>
                    </li>
                  ))}
              </ul>
              <Link href={searchUrl} onClick={() => setSearchValue("")}>
                Search {searchValue}
              </Link>
            </figcaption>
          </figure>
        </section>
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
