import { jsonStrapi } from "../lib/fetch-data";

export async function publishAction(documentId: string, userId: number) {
  const responseData = await jsonStrapi(
    "PUT",
    "/articles/" + documentId,
    { data: { draft: false }, userId: userId },
    { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } }
  );
  return responseData;
}
