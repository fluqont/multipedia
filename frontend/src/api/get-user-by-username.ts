import qs from "qs";
import { fetchStrapi } from "../lib/fetch-data";
import { UserWithFriends } from "../types/user";

export async function getUserByUsername(
  username: string | undefined,
  currentUser: UserWithFriends | null
) {
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
          fields: ["draft", "views"],
          populate: {
            topic: {
              fields: ["title"],
            },
          },
          filters: {
            $or: [
              {
                draft: {
                  $eq: false,
                },
              },
              {
                user: {
                  username: {
                    $eq: currentUser?.username,
                  },
                },
              },
              {
                shared: {
                  id: {
                    $in: [currentUser?.id],
                  },
                },
              },
            ],
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
