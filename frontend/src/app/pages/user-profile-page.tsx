import { useParams } from "wouter";
import { useEffect, useState } from "react";
import ErrorPage from "../../ui/error-page";
import UserProfile from "../../components/user-profile";
import { UserWithFriends } from "../../types/user";
import { getUserByUsername } from "../../api/get-user-by-username";
import UsersList from "../../components/users-list";
import { getFriends } from "../../lib/get-friends";
import { useCurrentUser } from "../../lib/context-as-hooks";

export interface StrapiError {
  error: {
    message: string;
  };
}

export default function UserProfilePage() {
  const { currentUser } = useCurrentUser();
  const { username } = useParams();

  const [userByUsername, setUserByUsername] = useState<
    null | UserWithFriends | StrapiError
  >(null);
  useEffect(() => {
    async function asyncFetch() {
      const usersOrError = await getUserByUsername(username);
      if (usersOrError.error) {
        setUserByUsername(usersOrError);
      } else {
        setUserByUsername(usersOrError[0]);
      }
    }
    asyncFetch();
  }, [username]);

  const { friends } = getFriends(
    userByUsername && "incoming" in userByUsername && userByUsername.incoming,
    userByUsername && "outcoming" in userByUsername && userByUsername.outcoming
  );

  return (
    <>
      {userByUsername && !("error" in userByUsername) && (
        <>
          <UserProfile
            user={userByUsername}
            showEditButton={userByUsername.username === currentUser?.username}
          />
          <UsersList
            users={friends}
            label="friends"
            userIsMe={currentUser?.id === userByUsername.id}
          />
        </>
      )}
      {userByUsername === undefined && <ErrorPage>User not found</ErrorPage>}
      {userByUsername && "error" in userByUsername && (
        <ErrorPage error={500}>Unexpected error</ErrorPage>
      )}
    </>
  );
}
