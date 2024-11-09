import { z } from "zod";
import { validateData } from "../lib/validate-data";
import { jsonStrapi } from "../lib/fetch-data";

const schemaRegister = z.object({
  title: z.string().min(2).max(255, {
    message: "Topic title must be between 2 and 20 characters",
  }),
});

export async function createTopicAction(formData: FormData) {
  const validation = validateData(formData, schemaRegister);
  if (!validation.success) {
    return { zodErrors: validation.error };
  }

  try {
    const responseData = await jsonStrapi(
      "POST",
      "/topics",
      {
        data: validation.data,
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } }
    );

    return responseData;
  } catch (e) {
    return { error: e };
  }
}
