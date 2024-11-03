import { FormEvent } from "react";
import { jsonStrapi } from "../lib/fetch-data";
import { z } from "zod";
import { validateData } from "../lib/validate-data";

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
  const validation = validateData(formData, schemaRegister);
  if (!validation.success) {
    return { zodErrors: validation.error };
  }

  try {
    const responseData = await jsonStrapi(
      "POST",
      "/auth/local",
      validation.data
    );

    if ("jwt" in responseData) {
      localStorage.setItem("jwt", responseData.jwt);
    }

    return responseData;
  } catch (e) {
    return { error: e };
  }
}
