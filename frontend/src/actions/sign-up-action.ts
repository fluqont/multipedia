import { FormEvent } from "react";
import { postStrapi } from "../lib/utils/fetchData";

export async function signUpAction(e: FormEvent) {
  const formData = new FormData(e.target as HTMLFormElement);
  const [username, email, password] = [
    formData.get("username"),
    formData.get("email"),
    formData.get("password"),
  ];
  try {
    const result = await postStrapi(
      "/auth/local/register",
      {},
      { username, email, password }
    );
    return result;
  } catch (e) {
    return { error: e };
  }
}
