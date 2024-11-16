import { jsonStrapi } from "../lib/fetch-data";

export async function publishAction(
  documentId: string,
  newStatus: boolean,
  userId: number
) {
  const responseData = await jsonStrapi(
    "PUT",
    "/articles/" + documentId,
    { data: { draft: newStatus }, userId: userId },
    { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } }
  );
  return responseData;
}
