import { useLocation } from "wouter";
import classes from "./user-profile.module.css";
import Pfp from "./pfp";
import { MinimalUser, User, UserWithFriends } from "../types/user";
import { getFriendshipStatus } from "../lib/get-friends";
import { useState } from "react";
import { StrapiError } from "../types/fetch";
import { manageFriendRequestAction } from "../api/send-friend-request-action";
import { useCurrentUser } from "../lib/context-as-hooks";
import { cn } from "../lib/cn";
import ErrorPage from "../ui/error-page";

interface UserProps {
  user: UserWithFriends | MinimalUser;
  updateUser?: () => void;
  showEditButton: boolean;
  addToFriends?: false | ReturnType<typeof getFriendshipStatus>;
  size?: "small" | "normal";
}

export default function UserProfile({
  user,
  updateUser,
  showEditButton,
  addToFriends = false,
  size,
}: UserProps) {
  const [, setLocation] = useLocation();

  const [result, setResult] = useState<null | User | StrapiError>();
  const { currentUser, updateCurrentUser } = useCurrentUser();

  async function handleSendFriendRequest() {
    setResult(
      await manageFriendRequestAction(
        currentUser &&
          "outcoming" in currentUser && [...currentUser.outcoming!, user]
      )
    );
  }
  async function handleCancelFriendRequest() {
    setResult(
      await manageFriendRequestAction(
        currentUser &&
          "outcoming" in currentUser &&
          currentUser.outcoming!.filter(
            (outcomingUser) => outcomingUser.id !== user.id
          )
      )
    );
  }

  if (result && "id" in result && typeof updateUser === "function") {
    updateUser();
    updateCurrentUser();
  }

  if (result && "error" in result) {
    return <ErrorPage error={result.errorCode}>{result.error}</ErrorPage>;
  }

  return (
    <>
      <div className={classes["user-wrapper"]}>
        <Pfp pfp={user.pfp} size={size === "small" ? 64 : 96} />
        <div className={classes.info}>
          <p
            className={cn([
              classes.username,
              size === "small" && classes["small-username"],
            ])}
          >
            {user.username}
          </p>
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
              onClick={
                addToFriends === "cancel friend request"
                  ? handleCancelFriendRequest
                  : handleSendFriendRequest
              }
              className={classes.button}
              disabled={addToFriends === "friend"}
            >
              {addToFriends}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
