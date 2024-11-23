import { Link } from "wouter";
import classes from "./user-profile.module.css";
import atomics from "../atomics.module.css";
import Pfp from "./pfp";
import { MinimalUser, User, FullUser } from "../types/user";
import { getFriendshipStatus } from "../lib/get-friends";
import { useState } from "react";
import { StrapiError } from "../types/fetch";
import { manageFriendRequestAction } from "../api/send-friend-request-action";
import { useCurrentUser } from "../lib/context-as-hooks";
import { cn } from "../lib/utils";
import ErrorPage from "../ui/error-page";

interface UserProps {
  user: FullUser | MinimalUser;
  updateUser?: () => void;
  showEditButton: boolean;
  showLikedButton?: boolean;
  addToFriends?: false | ReturnType<typeof getFriendshipStatus>;
  size?: "small" | "normal";
}

export default function UserProfile({
  user,
  updateUser,
  showEditButton,
  showLikedButton = false,
  addToFriends = false,
  size,
}: UserProps) {
  const [result, setResult] = useState<null | User | StrapiError>();
  const [loading, setLoading] = useState(false);
  const { currentUser, updateCurrentUser } = useCurrentUser();

  async function handleSendFriendRequest() {
    setLoading(true);
    setResult(
      await manageFriendRequestAction(
        currentUser &&
          "outcoming" in currentUser && [...currentUser.outcoming!, user]
      )
    );
  }
  async function handleCancelFriendRequest() {
    setLoading(true);
    setResult(
      await manageFriendRequestAction(
        currentUser &&
          "outcoming" in currentUser &&
          currentUser.outcoming.filter(
            (outcomingUser) => outcomingUser.id !== user.id
          )
      )
    );
  }

  if (result && loading) {
    setLoading(false);
  }

  if (result && "id" in result && typeof updateUser === "function") {
    updateUser();
    updateCurrentUser();
    setResult(null);
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
          <div className={classes.buttons}>
            {showEditButton && (
              <Link
                href="/users/me/edit"
                className={cn([atomics["link-button"], classes.button])}
              >
                edit
              </Link>
            )}
            {showLikedButton && (
              <Link
                href="/users/me/articles/liked"
                className={cn([atomics["link-button"], classes.button])}
              >
                liked
              </Link>
            )}
          </div>
          {addToFriends && (
            <button
              onClick={
                addToFriends === "cancel friend request"
                  ? handleCancelFriendRequest
                  : handleSendFriendRequest
              }
              className={classes.button}
              disabled={addToFriends === "friend" || loading}
            >
              {addToFriends}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
