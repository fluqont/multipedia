import { useLocation } from "wouter";
import atomics from "../atomics.module.css";
import { type User } from "../context/user-context";
import classes from "./user.module.css";
import { useUser } from "../lib/utils/context";

interface UserProps {
  user: User;
  showEditButton: boolean;
}

export default function User({ user, showEditButton }: UserProps) {
  const { user: savedUser } = useUser();
  const [, setLocation] = useLocation();
  return (
    <div className={classes["user-wrapper"]}>
      <img
        src={
          user.pfp
            ? import.meta.env.VITE_STRAPI_HOST + user.pfp.url
            : "/placeholder.svg"
        }
        alt="user pfp"
        width={96}
        height={96}
        className={atomics.pfp}
      />
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
  );
}
