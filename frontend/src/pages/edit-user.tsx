import { FormEvent, useState } from "react";
import Form from "../ui/form";
import InputField from "../ui/input-field";
import { Redirect } from "wouter";
import { updateUserAction } from "../lib/actions/update-user-action";
import { useUser } from "../lib/utils/context";
import { User } from "../context/user-context";
import FileInput from "../ui/file-input";

export default function EditUser() {
  const [result, setResult] = useState<null | Record<string, unknown>>(null);
  const { user, updateUser } = useUser();

  async function handleEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const pfp = user?.pfp as { id?: string };
    setResult(await updateUserAction(e, pfp?.id));
  }

  const resultUser = result?.user as User | undefined;
  if (resultUser) {
    updateUser();
    return <Redirect to={`/users/${resultUser.username}`} />;
  }

  const zodErrors = result?.zodErrors as Record<string, string> | undefined;
  return (
    <section>
      <Form
        error={(result?.error as Record<string, string> | undefined)?.message}
        onSubmit={handleEdit}
      >
        <FileInput id="pfp" labelText="new pfp" type="file" accept="image/*" />
        <InputField
          id="username"
          defaultValue={user?.username}
          error={zodErrors?.username}
        />
        <InputField id="bio" defaultValue={user?.bio} error={zodErrors?.bio} />
      </Form>
    </section>
  );
}
