import { z } from "zod";
import { postStrapi } from "../utils/fetch-data";
import { FormEvent } from "react";
import { validateData } from "../utils/validate-data";

const schemaRegister = z.object({
  username: z.string().min(3).max(20, {
    message: "Username must be between 3 and 20 characters",
  }),
  bio: z
    .string()
    .max(255, { message: "Bio must be less than 255 characters" })
    .optional(),
});

export async function updateUserAction(e: FormEvent<HTMLFormElement>) {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    return { error: "Not authorized" };
  }

  const formData = new FormData(e.target as HTMLFormElement);
  const validation = validateData(formData, schemaRegister);
  if (!validation.success) {
    return { zodErrors: validation.error };
  }

  try {
    const responseData = await postStrapi(
      "/user/me",
      { headers: { Authorization: `Bearer ${jwt}` } },
      validation.data,
      "PUT"
    );

    if (responseData.error) {
      return { error: responseData.error };
    }

    return { user: responseData };
  } catch (e) {
    return { error: e };
  }
}
