import { ChangeEvent, useEffect, useRef, useState } from "react";
import classes from "./search.module.css";
import { getUsersBySearch } from "../lib/actions/get-users-by-search";
import { type User } from "../context/user-context";
import { Link } from "wouter";
import useComponentVisible from "../hooks/useComponentVisible";

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
      const users = await getUsersBySearch(searchValue);
      setSearchResults(users);
    }

    if (resultsNeedUpdate && searchValue) {
      asyncFetch();
      setUpdateResults(false);
    }
  }, [resultsNeedUpdate]);

  const { ref, isComponentVisible } = useComponentVisible();
  return (
    <search className={classes.search} ref={ref}>
      <form className={classes["search-form"]}>
        <section className={classes["search-input-wrapper"]}>
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
            <h3 className={classes["results-list-title"]}>USERS</h3>
            <figcaption>
              <ul className={classes["results-list"]}>
                {searchResults &&
                  searchResults.map((user) => (
                    <li key={user.id} className={classes.result}>
                      <Link href={`/users/${user.username}`}>
                        {user.username}
                      </Link>
                    </li>
                  ))}
              </ul>
            </figcaption>
          </figure>
        </section>
      </form>
    </search>
  );
}
