import { Link } from "wouter";
import { MinimalUser } from "../lib/utils/get-friends";
import Pfp from "./pfp";
import atomics from "../atomics.module.css";
import classes from "./users-list.module.css";

interface UsersListProps {
  users: MinimalUser[];
  label: string;
  userIsMe: boolean;
}

export default function UsersList({ users, label, userIsMe }: UsersListProps) {
  return (
    <figure className={classes.friends}>
      <div className={classes["friends-header"]}>
        <h3 className={atomics.h3}>{label}</h3>
        {userIsMe && (
          <Link
            href="/users/me/friends/manage"
            className={atomics["link-button"]}
          >
            manage
          </Link>
        )}
      </div>
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
          <p>no {label}</p>
        )}
      </figcaption>
    </figure>
  );
}
