import { Redirect, useParams } from "wouter";
import { useEffect, useState } from "react";
import { getUserByUsername } from "../lib/actions/get-user-by-username";
import { type User } from "../context/user-context";
import { useUser } from "../lib/utils/context";
import classes from "./user.module.css";

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
  // TODO: not found if username is undefined

  const [edit, setEdit] = useState(false);
  if (edit && userByUsername) {
    return (
      <Redirect
        to={`/users/${username}/edit?id=${userByUsername.id}&bio=${userByUsername.bio}`}
      />
    );
  }

  return (
    <section>
      {userByUsername && (
        <div className={classes.info}>
          <h1>{userByUsername.username}</h1>
          {userByUsername.bio ? (
            <p>{userByUsername.bio}</p>
          ) : (
            <p className={classes["no-bio"]}>No bio</p>
          )}
          {userByUsername.username === user?.username && (
            <button onClick={() => setEdit(true)}>edit</button>
          )}
        </div>
      )}
    </section>
  );
}
