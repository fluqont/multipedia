import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { getUserByUsername } from "../lib/actions/get-user-by-username";
import { type User as IUser } from "../context/user-context";
import User from "../components/user";
import ErrorPage from "../ui/error-page";

export interface StrapiError {
  error: {
    message: string;
  };
}

export default function UserProfile() {
  const { username } = useParams();

  const [userByUsername, setUserByUsername] = useState<
    null | IUser | StrapiError
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
        <User user={userByUsername} showEditButton full />
      )}
      {userByUsername === undefined && <ErrorPage>User not found</ErrorPage>}
      {userByUsername && "error" in userByUsername && (
        <ErrorPage error={500}>Unexpected error</ErrorPage>
      )}
    </>
  );
}
