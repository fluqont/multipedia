import { FormEvent } from "react";
import { postStrapi } from "../utils/fetch-data";
import { z } from "zod";

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
  const validatedFields = schemaRegister.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      zodErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const responseData = await postStrapi(
      "/auth/local/register",
      {},
      validatedFields.data
    );

    if (responseData.error) {
      return { error: responseData.error };
    }

    localStorage.setItem("jwt", responseData.jwt);

    return { user: responseData.user };
  } catch (e) {
    return { error: e };
  }
}
