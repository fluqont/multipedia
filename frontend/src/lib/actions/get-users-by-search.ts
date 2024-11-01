import { fetchStrapi } from "../utils/fetch-data";
import qs from "qs";

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
