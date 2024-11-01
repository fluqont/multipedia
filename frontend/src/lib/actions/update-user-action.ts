import { z } from "zod";
import { jsonStrapi } from "../utils/fetch-data";
import { FormEvent } from "react";
import { validateData } from "../utils/validate-data";
import { uploadPfp } from "./upload-pfp-action";

const schemaRegister = z.object({
  username: z.string().min(3).max(20, {
    message: "Username must be between 3 and 20 characters",
  }),
  bio: z
    .string()
    .max(255, { message: "Bio must be less than 255 characters" })
    .optional(),
  pfp: z.any().optional(),
});

export async function updateUserAction(
  e: FormEvent<HTMLFormElement>,
  pfpId?: string
) {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    return { error: { message: "Not authorized" } };
  }

  const formData = new FormData(e.target as HTMLFormElement);
  const validation = validateData(formData, schemaRegister);
  if (!validation.success) {
    return { zodErrors: validation.error };
  }

  try {
    const responseData = await jsonStrapi("PUT", "/user/me", validation.data, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    if (responseData?.error) {
      return responseData;
    }

    const pfp = formData.get("pfp") as File;
    if (pfp.size !== 0) {
      const imageUploadData = await uploadPfp(pfpId, formData.get("pfp"));
      if (imageUploadData?.error) {
        return imageUploadData;
      }
    }

    return { user: responseData };
  } catch (e) {
    return { error: e };
  }
}
