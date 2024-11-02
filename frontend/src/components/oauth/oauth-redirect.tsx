import { Redirect, useParams } from "wouter";
import { useEffect, useState } from "react";
import { StrapiError } from "../../app/pages/user-profile-page";
import { useCurrentUser } from "../../lib/context-as-hooks";
import { getOAuthUser } from "../../api/oauth-redirect-action";
import ErrorPage from "../../ui/error-page";
import { User } from "../../types/user";

export default function OAuthRedirect() {
  const [oAuthUser, setOAuthUser] = useState<
    | null
    | {
        jwt: string;
        user: User;
      }
    | StrapiError
  >(null);

  const { updateCurrentUser } = useCurrentUser();

  const { provider } = useParams();

  useEffect(() => {
    async function asyncFetch() {
      if (provider) {
        setOAuthUser(await getOAuthUser(provider));
      }
    }
    asyncFetch();
  }, []);

  if (oAuthUser && "error" in oAuthUser) {
    return <ErrorPage error={500}>Unexpected error</ErrorPage>;
  }

  if (oAuthUser && "jwt" in oAuthUser) {
    localStorage.setItem("jwt", oAuthUser.jwt);
    updateCurrentUser();
    return <Redirect to={`/users/${oAuthUser.user.username}`} />;
  }

  return <h1>loading user</h1>;
}
