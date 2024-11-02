import qs from "qs";
import { fetchStrapi } from "../lib/fetch-data";

export async function getUser() {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    return false;
  }

  try {
    const query = qs.stringify(
      {
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
        },
      },
      {
        encodeValuesOnly: true, // prettify URL
      }
    );

    const user = await fetchStrapi(`/users/me?${query}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    if (user.error) {
      return false;
    }

    return user;
  } catch {
    return false;
  }
}
