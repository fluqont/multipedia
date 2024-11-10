import qs from "qs";
import { fetchStrapi } from "../lib/fetch-data";

export async function getUserByUsername(username: string | undefined) {
  const query = qs.stringify(
    {
      fields: ["username", "bio"],
      populate: {
        pfp: {
          fields: ["url"],
        },
        outcoming: {
          fields: ["username"],
          populate: {
            pfp: {
              fields: ["url"],
            },
          },
        },
        incoming: {
          fields: ["username"],
          populate: {
            pfp: {
              fields: ["url"],
            },
          },
        },
        articles: {
          fields: ["draft"],
          populate: {
            topic: {
              fields: ["title"],
            },
          },
        },
      },
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

  const user = await fetchStrapi(`/users?${query}`);
  return user;
}
