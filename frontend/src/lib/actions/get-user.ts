import qs from "qs";
import { fetchStrapi } from "../utils/fetch-data";

export async function getUser() {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    return false;
  }

  try {
    const query = qs.stringify({
      populate: {
        pfp: {
          fields: ["url"],
        },
      },
    });

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
