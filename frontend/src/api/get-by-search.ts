import qs from "qs";
import { fetchQuery } from "../lib/fetch-data";

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

  return fetchQuery(`/users?${query}`);
}

export async function getArticlesBySearch(topic: string) {
  const query = qs.stringify(
    {
      fields: ["draft"],
      populate: {
        topic: {
          fields: ["title"],
        },
        user: {
          fields: ["username"],
          populate: {
            pfp: {
              fields: ["url"],
            },
          },
        },
      },
      filters: {
        topic: {
          title: {
            $contains: topic,
          },
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );

  return fetchQuery(`/articles?${query}`);
}
