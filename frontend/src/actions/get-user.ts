import { fetchStrapi } from "../lib/utils/fetch-data";

export async function getUser() {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    return false;
  }

  try {
    const user = await fetchStrapi("/users/me", {
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
