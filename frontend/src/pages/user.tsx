import { Redirect, useParams } from "wouter";
import { useEffect, useState } from "react";
import { getUserByUsername } from "../lib/actions/get-user-by-username";
import { type User } from "../context/user-context";
import { useUser } from "../lib/utils/context";
import classes from "./user.module.css";
import atomics from "../atomics.module.css";
import ErrorPage from "../ui/error-page";

interface StrapiError {
  error: {
    message: string;
  };
}

export default function User() {
  const { username } = useParams();

  const { user } = useUser();

  const [userByUsername, setUserByUsername] = useState<
    null | User | StrapiError
  >(null);
  useEffect(() => {
    async function asyncFetch() {
      const usersOrError = await getUserByUsername(username);
      if (usersOrError.error) {
        setUserByUsername(usersOrError);
      } else {
        setUserByUsername(usersOrError[0]);
      }
    }
    asyncFetch();
  }, [username]);

  const [edit, setEdit] = useState(false);
  if (edit && userByUsername) {
    return <Redirect to="/users/me/edit" />;
  }

  return (
    <>
      {userByUsername && !("error" in userByUsername) && (
        <section className={classes.section}>
          <img
            src={
              userByUsername.pfp
                ? import.meta.env.VITE_STRAPI_HOST + userByUsername.pfp.url
                : "/placeholder.svg"
            }
            alt="user pfp"
            width={96}
            height={96}
            className={atomics.pfp}
          />
          <div className={classes.info}>
            <h1>{userByUsername.username}</h1>
            {userByUsername.bio ? (
              <p className={classes["bio"]}>{userByUsername.bio}</p>
            ) : (
              <p className={classes["no-bio"]}>No bio</p>
            )}
            {userByUsername.username === user?.username && (
              <button onClick={() => setEdit(true)} className={classes.button}>
                edit
              </button>
            )}
          </div>
        </section>
      )}
      {userByUsername === undefined && <ErrorPage>User not found</ErrorPage>}
      {userByUsername && "error" in userByUsername && (
        <ErrorPage error={500}>Unexpected error</ErrorPage>
      )}
    </>
  );
}
