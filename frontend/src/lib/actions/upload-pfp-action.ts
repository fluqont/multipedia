import { postStrapi } from "../utils/fetch-data";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadPfp(pfpId: string | undefined, pfp: any) {
  const jwt = localStorage.getItem("jwt");

  if (pfpId) {
    try {
      await postStrapi(
        `/upload/files/${pfpId}`,
        { headers: { Authorization: `Bearer ${jwt}` } },
        {},
        "DELETE"
      );
    } catch {
      return { error: { message: "Failed to delete previous image" } };
    }
  }

  const formData = new FormData();
  formData.append("files", pfp, pfp.name);

  const url = new URL("/api/upload", import.meta.env.VITE_STRAPI_BASE_URL);
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${jwt}` },
    method: "POST",
    body: formData,
  });

  const fileUploadResponse = await response.json();
  if (fileUploadResponse.error) {
    return fileUploadResponse;
  }

  const updatedPfpId = { pfp: fileUploadResponse[0].id as string };
  const updateImageResponse = await postStrapi(
    "/user/me",
    { headers: { Authorization: `Bearer ${jwt}` } },
    updatedPfpId,
    "PUT"
  );
  if (updateImageResponse.error) {
    return updateImageResponse;
  }
}
