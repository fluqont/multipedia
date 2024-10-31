import { FormEvent, useState } from "react";
import Form from "../ui/form";
import InputField from "../ui/input-field";
import { Redirect, useParams } from "wouter";
import { updateUserAction } from "../lib/actions/update-user-action";
import { useUser } from "../lib/utils/context";
import { User } from "../context/user-context";

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

  const resultUser = result?.user as User | undefined;
  if (resultUser) {
    if (resultUser.id === user?.id) {
      updateUser();
    }
    return <Redirect to={`/users/${resultUser.username}`} />;
  }

  const zodErrors = result?.zodErrors as Record<string, string> | undefined;
  return (
    <section>
      <Form
        error={(result?.error as Record<string, string> | undefined)?.message}
        onSubmit={handleEdit}
      >
        <InputField
          id="username"
          defaultValue={username}
          error={zodErrors?.username}
        />
        <InputField
          id="bio"
          defaultValue={params.get("bio") as string}
          error={zodErrors?.bio}
        />
      </Form>
    </section>
  );
}
