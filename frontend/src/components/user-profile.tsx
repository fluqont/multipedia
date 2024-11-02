import { useLocation } from "wouter";
import classes from "./user-profile.module.css";
import { useUser } from "../lib/utils/context-as-hooks";
import { getFriends } from "../lib/utils/get-friends";
import Pfp from "./pfp";
import UsersList from "./users-list";
import { MinimalUser, UserWithFriends } from "../types/user";

interface UserProps {
  // TODO: clarity in user types
  user: UserWithFriends | MinimalUser;
  showEditButton: boolean;
  full?: boolean;
  size?: number;
}

export default function UserProfile({
  user,
  showEditButton,
  full = false,
  size,
}: UserProps) {
  const { user: savedUser } = useUser();
  const [, setLocation] = useLocation();

  const { friends } = getFriends(
    full,
    "incoming" in user ? user?.incoming : undefined,
    "outcoming" in user ? user.outcoming : undefined
  );

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
          <UsersList
            users={friends}
            label="friends"
            userIsMe={savedUser?.id === user.id}
          />
        </>
      )}
    </>
  );
}
