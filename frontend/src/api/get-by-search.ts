import qs from "qs";
import { fetchQuery } from "../lib/fetch-data";

export async function getUsersBySearch(
  username: string | undefined,
  bio: boolean,
  limit: boolean
) {
  const query = qs.stringify(
    {
      pagination: limit && {
        limit: 4,
      },
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

export async function getArticlesBySearch(topic: string, limit: boolean) {
  const query = qs.stringify(
    {
      pagination: limit && {
        limit: 4,
      },
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
