import { useLocation } from "wouter";
import classes from "./user-profile.module.css";
import Pfp from "./pfp";
import { MinimalUser, User, UserWithFriends } from "../types/user";
import { getFriendshipStatus } from "../lib/get-friends";
import { useEffect, useState } from "react";
import { StrapiError } from "../types/fetch";
import { sendFriendRequestAction } from "../api/send-friend-request-action";
import { useCurrentUser } from "../lib/context-as-hooks";

interface UserProps {
  user: UserWithFriends | MinimalUser;
  updateUser?: () => void;
  showEditButton: boolean;
  addToFriends?: false | ReturnType<typeof getFriendshipStatus>;
  pfpSize?: number;
}

export default function UserProfile({
  user,
  updateUser,
  showEditButton,
  addToFriends = false,
  pfpSize,
}: UserProps) {
  const [, setLocation] = useLocation();

  const [result, setResult] = useState<null | User | StrapiError>();
  const { currentUser } = useCurrentUser();

  async function handleSendFriendRequest() {
    setResult(await sendFriendRequestAction(user, currentUser?.outcoming));
  }

  useEffect(() => {
    if (result && "id" in result && typeof updateUser === "function") {
      updateUser();
    }
  }, [result]);

  return (
    <>
      <div className={classes["user-wrapper"]}>
        <Pfp pfp={user.pfp} size={pfpSize} />
        <div className={classes.info}>
          <h1>{user.username}</h1>
          {"bio" in user && user.bio ? (
            <p className={classes["bio"]}>{user.bio}</p>
          ) : (
            <p className={classes["no-bio"]}>No bio</p>
          )}
          {showEditButton && (
            <button
              onClick={() => setLocation("/users/me/edit")}
              className={classes.button}
            >
              edit
            </button>
          )}
          {addToFriends && (
            <button
              onClick={handleSendFriendRequest}
              className={classes.button}
              disabled={
                addToFriends === "friend" ||
                addToFriends === "friend request sent"
              }
            >
              {addToFriends}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
