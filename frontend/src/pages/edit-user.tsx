import { FormEvent, useState } from "react";
import Form from "../ui/form";
import InputField from "../ui/input-field";
import { Redirect, useParams } from "wouter";
import { updateUserAction } from "../lib/actions/update-user-action";
import { useUser } from "../lib/utils/context";

export default function EditUser() {
  const params = new URLSearchParams(window.location.search);
  // TODO: error if user is undefined
  const [result, setResult] = useState<null | Record<string, unknown>>(null);
  const { user, updateUser } = useUser();

  const { username } = useParams();

  async function handleEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setResult(await updateUserAction(Number(params.get("id") as string), e));
  }

  if (result?.user) {
    if (result?.user?.id === user?.id) {
      updateUser();
    }
    return <Redirect to={`/users/${result?.user?.username}`} />;
  }

  return (
    <section>
      {/* @ts-expect-error even if message doesn't exist, error is not thrown */}
      <Form error={result?.error?.message} onSubmit={handleEdit}>
        <InputField
          id="username"
          defaultValue={username}
          // @ts-expect-error even if message doesn't exist, error is not thrown
          error={result?.zodErrors?.username}
        />
        <InputField
          id="bio"
          defaultValue={params.get("bio") as string}
          // @ts-expect-error even if message doesn't exist, error is not thrown
          error={result?.zodErrors?.bio}
        />
      </Form>
    </section>
  );
}
