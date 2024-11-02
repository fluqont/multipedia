import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { getUserByUsername } from "../../lib/actions/get-user-by-username";
import ErrorPage from "../../ui/error-page";
import UserProfile from "../../components/user-profile";
import { User } from "../../types/user";

export interface StrapiError {
  error: {
    message: string;
  };
}

export default function UserProfilePage() {
  const { username } = useParams();

  const [userByUsername, setUserByUsername] = useState<
    null | User | StrapiError
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

  return (
    <>
      {userByUsername && !("error" in userByUsername) && (
        <UserProfile user={userByUsername} showEditButton full />
      )}
      {userByUsername === undefined && <ErrorPage>User not found</ErrorPage>}
      {userByUsername && "error" in userByUsername && (
        <ErrorPage error={500}>Unexpected error</ErrorPage>
      )}
    </>
  );
}
