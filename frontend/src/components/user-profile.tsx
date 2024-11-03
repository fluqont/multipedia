import { useLocation } from "wouter";
import classes from "./user-profile.module.css";
import { useCurrentUser } from "../lib/context-as-hooks";
import Pfp from "./pfp";
import { MinimalUser, UserWithFriends } from "../types/user";

interface UserProps {
  // TODO: clarity in user types
  user: UserWithFriends | MinimalUser;
  showEditButton: boolean;
  size?: number;
}

export default function UserProfile({ user, showEditButton, size }: UserProps) {
  const { currentUser } = useCurrentUser();
  const [, setLocation] = useLocation();

  // 1. friends: pfp, username, column
  // 2. search: pfp, username, row
  // 3. search page, profile: pfp, username, bio, row

  return (
    <>
      <div className={classes["user-wrapper"]}>
        <Pfp pfp={user.pfp} size={size} />
        <div className={classes.info}>
          <h1>{user.username}</h1>
          {"bio" in user && user.bio ? (
            <p className={classes["bio"]}>{user.bio}</p>
          ) : (
            <p className={classes["no-bio"]}>No bio</p>
          )}
          {showEditButton && user.username === currentUser?.username && (
            <button
              onClick={() => setLocation("/users/me/edit")}
              className={classes.button}
            >
              edit
            </button>
          )}
        </div>
      </div>
    </>
  );
}
