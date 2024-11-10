import { useParams } from "wouter";
import { useEffect, useState } from "react";
import ErrorPage from "../../ui/error-page";
import UserProfile from "../../components/user-profile";
import { FullUser } from "../../types/user";
import { getUserByUsername } from "../../api/get-user-by-username";
import UsersList from "../../components/users-list";
import { getFriends, getFriendshipStatus } from "../../lib/get-friends";
import { useCurrentUser } from "../../lib/context-as-hooks";
import { FetchError } from "../../types/fetch";
import ArticleList from "../../components/article-list";
import classes from "./user-profile-page.module.css";

export default function UserProfilePage() {
  const { currentUser } = useCurrentUser();
  const { username } = useParams();

  const [userByUsername, setUserByUsername] = useState<
    null | FullUser | FetchError
  >(null);
  async function asyncFetch() {
    const usersOrError = await getUserByUsername(username);
    if (usersOrError.error) {
      setUserByUsername(usersOrError);
    } else {
      setUserByUsername(usersOrError[0]);
    }
  }
  useEffect(() => {
    asyncFetch();
  }, [username]);

  const relations = getFriends(
    userByUsername && "incoming" in userByUsername && userByUsername.incoming,
    userByUsername && "outcoming" in userByUsername && userByUsername.outcoming
  );

  const friendshipStatus = currentUser
    ? getFriendshipStatus(currentUser.id, relations)
    : false;

  return (
    <>
      {userByUsername && !("error" in userByUsername) && (
        <>
          <UserProfile
            user={userByUsername}
            updateUser={asyncFetch}
            showEditButton={userByUsername.username === currentUser?.username}
            addToFriends={
              userByUsername.username !== currentUser?.username &&
              friendshipStatus
            }
          />
          <div className={classes.lists}>
            <UsersList
              users={relations.friends}
              label="friends"
              userIsMe={currentUser?.id === userByUsername.id}
            />
            <ArticleList
              articles={userByUsername.articles.filter(
                (article, index, self) =>
                  index ===
                  self.findIndex((t) => t.topic.id === article.topic.id)
              )}
              label="articles"
              userIsMe={currentUser?.id === userByUsername.id}
              username={userByUsername.username}
            />
          </div>
        </>
      )}
      {userByUsername === undefined && <ErrorPage>User not found</ErrorPage>}
      {userByUsername && "error" in userByUsername && (
        <ErrorPage error={userByUsername.errorCode}>
          {userByUsername.error}
        </ErrorPage>
      )}
    </>
  );
}
