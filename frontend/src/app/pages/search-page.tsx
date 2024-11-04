import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import classes from "./search-page.module.css";
import atomics from "../../atomics.module.css";
import ErrorPage from "../../ui/error-page";
import UserProfile from "../../components/user-profile";
import { User } from "../../types/user";
import { getUsersBySearch } from "../../api/get-users-by-search";
import InputField from "../../ui/input-field";
import Form from "../../ui/form";

export default function SearchPage() {
  const searchValue = useSearch().split("q=")[1];
  const [searchResults, setSearchResults] = useState<null | User[]>(null);

  useEffect(() => {
    async function asyncFetch() {
      const users = await getUsersBySearch(searchValue, true);
      setSearchResults(users);
    }

    if (searchValue) {
      asyncFetch();
    }
  }, [searchValue]);

  const [, setLocation] = useLocation();

  if (searchResults?.length === 0) {
    return <ErrorPage>Nothing found</ErrorPage>;
  }

  function handleMobileSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const search = new FormData(e.currentTarget).get("search");
    setLocation(`/search?q=${search}`);
  }

  return (
    <>
      <Form className={classes["mobile-search"]} onSubmit={handleMobileSubmit}>
        <InputField id="search" />
      </Form>
      <figure className={classes["search-page-wrapper"]}>
        <h3 className={atomics.h3}>USERS</h3>
        <figcaption>
          <ul className={classes.results}>
            {searchResults ? (
              searchResults.map((user) => (
                <Link href={`/users/${user.username}`} key={user.id}>
                  <UserProfile user={user} showEditButton={false} />
                </Link>
              ))
            ) : (
              <p>Nothing found</p>
            )}
          </ul>
        </figcaption>
      </figure>
    </>
  );
}
