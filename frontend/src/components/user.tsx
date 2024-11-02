import { Link, useLocation } from "wouter";
import atomics from "../atomics.module.css";
import { type User } from "../context/user-context";
import classes from "./user.module.css";
import { useUser } from "../lib/utils/context";
import { getFriends, MinimalUser } from "../lib/utils/get-friends";
import Pfp from "./pfp";

interface UserProps {
  user: User;
  showEditButton: boolean;
  full: boolean;
}

export default function User({
  user,
  showEditButton,
  full = false,
}: UserProps) {
  const { user: savedUser } = useUser();
  const [, setLocation] = useLocation();

  const { friends, outcoming, incoming } = getFriends(
    full,
    user.incoming,
    user.outcoming
  );

  return (
    <>
      <div className={classes["user-wrapper"]}>
        <Pfp pfp={user.pfp} />
        <div className={classes.info}>
          <h1>{user.username}</h1>
          {user.bio ? (
            <p className={classes["bio"]}>{user.bio}</p>
          ) : (
            <p className={classes["no-bio"]}>No bio</p>
          )}
          {showEditButton && user.username === savedUser?.username && (
            <button
              onClick={() => setLocation("/users/me/edit")}
              className={classes.button}
            >
              edit
            </button>
          )}
        </div>
      </div>
      {full && (
        <>
          <UsersList users={friends} label="friends" />
          {savedUser?.id === user.id && (
            <>
              <UsersList users={outcoming} label="outcoming" />
              <UsersList users={incoming} label="incoming" />
            </>
          )}
        </>
      )}
    </>
  );
}

interface UsersListProps {
  users: MinimalUser[];
  label: string;
}

function UsersList({ users, label }: UsersListProps) {
  return (
    <figure className={classes.friends}>
      <h3 className={atomics.h3}>{label}</h3>
      <figcaption>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.username} className={classes["pfp-wrapper"]}>
                <Link href={`/users/${user.username}`}>
                  <Pfp pfp={user.pfp} size={64} />
                  <p className={classes["pfp-username"]}>{user.username}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>no outcoming</p>
        )}
      </figcaption>
    </figure>
  );
}
