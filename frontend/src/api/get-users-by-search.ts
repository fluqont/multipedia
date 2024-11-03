import qs from "qs";
import { fetchStrapi } from "../lib/fetch-data";

export async function getUsersBySearch(
  username: string | undefined,
  bio: boolean
) {
  const query = qs.stringify(
    {
      fields: ["username", bio ? "bio" : undefined],
      populate: {
        pfp: {
          fields: ["url"],
        },
      },
      filters: {
        username: {
          $contains: username,
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );

  const users = await fetchStrapi(`/users?${query}`);
  return users;
}
