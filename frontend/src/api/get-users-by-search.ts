import qs from "qs";
import { fetchStrapi } from "../lib/fetch-data";

export async function getUsersBySearch(username: string | undefined) {
  const query = qs.stringify(
    {
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

  try {
    const users = await fetchStrapi(`/users?${query}`);
    return users;
  } catch (err) {
    return { error: { message: err } };
  }
}
