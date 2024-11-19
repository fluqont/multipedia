import { Link, useParams } from "wouter";
import { useEffect, useState } from "react";
import ErrorPage from "../../ui/error-page";
import UserProfile from "../../components/user-profile";
import { FullUser, MinimalUser } from "../../types/user";
import { getUserByUsername } from "../../api/get-user-by-username";
import { getFriends, getFriendshipStatus } from "../../lib/get-friends";
import { useCurrentUser } from "../../lib/context-as-hooks";
import { FetchError } from "../../types/fetch";
import classes from "./user-profile-page.module.css";
import { getArticles } from "../../lib/get-articles";
import Pfp from "../../components/pfp";
import atomics from "../../atomics.module.css";
import ListWithHeader from "../../components/list-with-header";
import { Article } from "../../types/article";
import Card from "../../ui/card";
import ArticleStats from "../../components/article-stats";

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

  const userArticles = getArticles(
    userByUsername && "articles" in userByUsername && userByUsername.articles
  );

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
            <UserList
              users={relations.friends}
              label="friends"
              userIsMe={currentUser?.id === userByUsername.id}
            />
            <ArticleList
              articles={userArticles.articles}
              label="articles"
              username={userByUsername.username}
              userIsMe={currentUser?.id === userByUsername.id}
            />
            {currentUser?.id === userByUsername.id && (
              <ArticleList
                articles={userArticles.drafts}
                label="drafts"
                username={userByUsername.username}
                userIsMe={currentUser?.id === userByUsername.id}
              />
            )}
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

interface UsersListProps {
  users: MinimalUser[];
  label: string;
  userIsMe: boolean;
}

function UserList({ users, userIsMe }: UsersListProps) {
  return (
    <ListWithHeader
      headerLabel="friends"
      additionalHeaderItems={
        <>
          {userIsMe && (
            <Link
              href="/users/me/friends/manage"
              className={atomics["link-button"]}
            >
              manage
            </Link>
          )}
        </>
      }
    >
      {users.length > 0 ? (
        <ul className={classes["user-list"]}>
          {users.map((user) => (
            <li key={user.username}>
              <Link
                href={`/users/${user.username}`}
                className={classes["pfp-wrapper"]}
              >
                <Pfp pfp={user.pfp} size={64} />
                <p className={classes.username}>{user.username}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <i>nothing</i>
        </p>
      )}
    </ListWithHeader>
  );
}

interface ArticleListProps {
  articles: Article[];
  label: string;
  username: string;
  userIsMe: boolean;
}

function ArticleList({
  articles,
  label,
  username,
  userIsMe,
}: ArticleListProps) {
  return (
    <ListWithHeader
      headerLabel={label}
      additionalHeaderItems={
        <>
          {userIsMe && (
            <Link
              href="/users/me/articles/manage"
              className={atomics["link-button"]}
            >
              manage
            </Link>
          )}
        </>
      }
    >
      {articles.length > 0 ? (
        <ul className={classes["article-list"]}>
          {articles.map((article) => (
            <li key={article.id}>
              <Card
                title={
                  <Link
                    href={`/users/${username}/articles/${article.topic.title}`}
                  >
                    {article.topic.title}
                  </Link>
                }
              >
                <ArticleStats
                  isArticleFetched={true}
                  article={article}
                  action={false}
                />
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <i>nothing</i>
        </p>
      )}
    </ListWithHeader>
  );
}
