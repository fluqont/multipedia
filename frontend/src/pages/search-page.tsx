import { useEffect, useState } from "react";
import type { User as IUser } from "../context/user-context";
import { getUsersBySearch } from "../lib/actions/get-users-by-search";
import { Link, useSearch } from "wouter";
import ErrorPage from "../ui/error-page";
import User from "../components/user";
import classes from "./search-page.module.css";
import atomics from "../atomics.module.css";

export default function Search() {
  const searchValue = useSearch().split("q=")[1];
  const [searchResults, setSearchResults] = useState<null | IUser[]>(null);

  useEffect(() => {
    async function asyncFetch() {
      const users = await getUsersBySearch(searchValue);
      setSearchResults(users);
    }

    if (searchValue) {
      asyncFetch();
    }
  }, [searchValue]);

  if (searchResults === undefined) {
    return <ErrorPage>Nothing found</ErrorPage>;
  }

  if (!searchResults) {
    return;
  }

  return (
    <figure>
      <h3 className={atomics.h3}>USERS</h3>
      <figcaption>
        <ul className={classes.results}>
          {searchResults.map((user) => (
            <Link href={`/users/${user.username}`}>
              <User user={user} showEditButton={false} key={user.id} />
            </Link>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
