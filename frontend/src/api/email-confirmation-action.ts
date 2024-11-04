import { fetchStrapi } from "../lib/fetch-data";

export async function emailConfirmationAction(
  confirmationToken: string | null
) {
  const response = await fetchStrapi(
    `${
      import.meta.env.VITE_STRAPI_BASE_URL
    }/auth/email-confimation?confirmation=${confirmationToken}`
  );
  return response;
}
