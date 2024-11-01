import { FormEvent } from "react";
import { jsonStrapi } from "../utils/fetch-data";
import { z } from "zod";
import { validateData } from "../utils/validate-data";

const schemaRegister = z.object({
  username: z.string().min(3).max(20, {
    message: "Username must be between 3 and 20 characters",
  }),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export async function signUpAction(e: FormEvent) {
  const formData = new FormData(e.target as HTMLFormElement);
  const validation = validateData(formData, schemaRegister);
  if (!validation.success) {
    return { zodErrors: validation.error };
  }

  try {
    const responseData = await jsonStrapi(
      "POST",
      "/auth/local/register",
      validation.data
    );

    if (responseData?.error) {
      return responseData;
    }

    localStorage.setItem("jwt", responseData.jwt);

    return { user: responseData.user };
  } catch (e) {
    return { error: e };
  }
}
