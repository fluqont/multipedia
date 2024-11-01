import { fetchStrapi } from "../utils/fetch-data";
import qs from "qs";

export async function getUserByUsername(username: string | undefined) {
  const query = qs.stringify(
    {
      filters: {
        username: {
          $eq: username,
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );

  try {
    const user = await fetchStrapi(`/users?${query}`);
    return user;
  } catch (err) {
    return { error: { message: err } };
  }
}
