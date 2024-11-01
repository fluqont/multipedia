import { Redirect, useParams } from "wouter";
import { fetchStrapi } from "../lib/utils/fetch-data";
import { useEffect, useState } from "react";
import { useUser } from "../lib/utils/context";
import { type User } from "../context/user-context";

export default function OAuthRedirect() {
  const [oAuthUser, setOAuthUser] = useState<null | {
    jwt: string;
    user: User;
  }>(null);

  const { updateUser } = useUser();

  const { provider } = useParams();
  const search = window.location.href.split("?")[1];
  const url = `/auth/${provider}/callback?` + search;

  useEffect(() => {
    async function asyncFetch() {
      setOAuthUser(await fetchStrapi(url));
    }
    asyncFetch();
  }, []);

  if (oAuthUser?.jwt) {
    localStorage.setItem("jwt", oAuthUser?.jwt);
    updateUser();
    return <Redirect to={`/users/${oAuthUser.user.username}`} />;
  }

  return <h1>loading user</h1>;
}
