import { Redirect } from "wouter";
import { fetchStrapi } from "../lib/utils/fetch-data";
import { useEffect, useState } from "react";
import { useUser } from "../lib/utils/context";
import { type User } from "../context/user-context";

export default function GitHubOAuth() {
  const [gitHubUser, setGitHubUser] = useState<null | {
    jwt: string;
    user: User;
  }>(null);

  const { updateUser } = useUser();

  const search = window.location.href.split("?")[1];
  const url = "/auth/github/callback?" + search;

  useEffect(() => {
    async function asyncFetch() {
      setGitHubUser(await fetchStrapi(url));
    }
    asyncFetch();
  }, []);

  if (gitHubUser?.jwt) {
    localStorage.setItem("jwt", gitHubUser?.jwt);
    updateUser();
    return <Redirect to={`/users/${gitHubUser.user.username}`} />;
  }

  return <h1>hello, world!</h1>;
}
