import { fetchStrapi } from "../lib/fetch-data";

export async function getOAuthUser(provider: string) {
  const search = window.location.href.split("?")[1];
  const url = `/auth/${provider}/callback?` + search;
  const result = await fetchStrapi(url);
  return result;
}
