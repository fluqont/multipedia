import { z } from "zod";
import { jsonStrapi } from "../lib/fetch-data";

const schemaRegister = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export async function newConfirmationRequestAction(
  formData: FormData
) {
  const validatedFields = schemaRegister.safeParse(
    Object.fromEntries(formData)
  );
  if (!validatedFields.success) {
    return { zodErrors: validatedFields.error.flatten().fieldErrors };
  }

  const { email } = validatedFields.data;

  const data = await jsonStrapi("POST", "/auth/send-email-confirmation", {
    email,
  });
  return data;
}
