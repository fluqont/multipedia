import { fetchStrapi } from "../lib/fetch-data";

export async function getOAuthUser(provider: string) {
  const search = new URL(window.location.href).searchParams;
  const url = `/auth/${provider}/callback?access_token=${search.get(
    "access_token"
  )}`;
  const result = await fetchStrapi(url);
  return result;
}
