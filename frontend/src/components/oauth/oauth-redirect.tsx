import { Redirect, useParams } from "wouter";
import { useEffect, useState } from "react";
import { User } from "../../context/user-context";
import { StrapiError } from "../../app/pages/user-profile-page";
import { useUser } from "../../lib/utils/context-as-hooks";
import { getOAuthUser } from "../../lib/actions/oauth-redirect-action";
import ErrorPage from "../../ui/error-page";

export default function OAuthRedirect() {
  const [oAuthUser, setOAuthUser] = useState<
    | null
    | {
        jwt: string;
        user: User;
      }
    | StrapiError
  >(null);

  const { updateUser } = useUser();

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
    updateUser();
    return <Redirect to={`/users/${oAuthUser.user.username}`} />;
  }

  return <h1>loading user</h1>;
}
