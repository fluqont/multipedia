import { FormEvent } from "react";
import { postStrapi } from "../utils/fetch-data";
import { z } from "zod";

const schemaRegister = z.object({
  identifier: z
    .string()
    .min(3)
    .max(20, {
      message: "Username must be between 3 and 20 characters",
    })
    .or(z.string().email()),
  password: z.string().min(6).max(100, {
    message: "Password must be between 6 and 100 characters",
  }),
});

export async function loginAction(e: FormEvent) {
  const formData = new FormData(e.target as HTMLFormElement);
  const validatedFields = schemaRegister.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      zodErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const responseData = await postStrapi(
      "/auth/local",
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
