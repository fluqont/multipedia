import { Redirect, useParams } from "wouter";
import { useEffect, useState } from "react";
import { getUserByUsername } from "../lib/actions/get-user-by-username";
import { type User } from "../context/user-context";
import { useUser } from "../lib/utils/context";
import classes from "./user.module.css";
import ErrorPage from "../ui/error-page";

export default function User() {
  const { username } = useParams();

  const { user } = useUser();

  const [userByUsername, setUserByUsername] = useState<null | User>(null);
  useEffect(() => {
    async function asyncFetch() {
      setUserByUsername((await getUserByUsername(username))[0]);
    }
    asyncFetch();
  }, []);

  const [edit, setEdit] = useState(false);
  if (edit && userByUsername) {
    return <Redirect to="/users/me/edit" />;
  }

  return (
    <section>
      {userByUsername && (
        <div className={classes.wrapper}>
          <img
            src={
              user?.pfp
                ? import.meta.env.VITE_STRAPI_HOST + user?.pfp?.url
                : "/placeholder.svg"
            }
            alt="user pfp"
            width={96}
            height={96}
            className={classes.pfp}
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
        </div>
      )}
      {userByUsername === undefined && <ErrorPage>User not found</ErrorPage>}
    </section>
  );
}
