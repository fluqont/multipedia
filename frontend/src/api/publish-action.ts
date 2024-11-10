import { jsonStrapi } from "../lib/fetch-data";

export async function publishAction(documentId: string) {
  const responseData = await jsonStrapi(
    "PUT",
    "/articles/" + documentId,
    { data: { draft: false } },
    { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } }
  );
  return responseData;
}
