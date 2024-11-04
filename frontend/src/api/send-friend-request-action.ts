import { jsonStrapi } from "../lib/fetch-data";
import { MinimalUser } from "../types/user";

export async function manageFriendRequestAction(
  newOutcoming?: MinimalUser[] | false | null
) {
  if (!newOutcoming) {
    return {
      errorCode: 400,
      error: "Couldn't update user's outcoming request",
    };
  }
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    return { error: { message: "Not authorized" } };
  }

  const responseData = await jsonStrapi(
    "PUT",
    "/user/me",
    { outcoming: newOutcoming },
    {
      headers: { Authorization: `Bearer ${jwt}` },
    }
  );

  return responseData;
}
