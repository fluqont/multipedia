import { fetchStrapi, jsonStrapi } from "../utils/fetch-data";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadPfp(pfpId: string | undefined, pfp: any) {
  const jwt = localStorage.getItem("jwt");

  if (pfpId) {
    try {
      await jsonStrapi("DELETE", `/upload/files/${pfpId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
    } catch {
      return { error: { message: "Failed to delete previous image" } };
    }
  }

  const formData = new FormData();
  formData.append("files", pfp, pfp.name);

  const fileUploadResponse = await fetchStrapi("/upload", {
    headers: { Authorization: `Bearer ${jwt}` },
    method: "POST",
    body: formData,
  });
  if (fileUploadResponse.error) {
    return fileUploadResponse;
  }

  const updatedPfpId = { pfp: fileUploadResponse[0].id as string };
  const updateImageResponse = await jsonStrapi(
    "PUT",
    "/user/me",
    updatedPfpId,
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
  if (updateImageResponse.error) {
    return updateImageResponse;
  }
}
