import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Form from "../ui/form";
import InputField from "../ui/input-field";
import { Redirect } from "wouter";
import { updateUserAction } from "../lib/actions/update-user-action";
import { useUser } from "../lib/utils/context";
import { User } from "../context/user-context";
import FileInput from "../ui/file-input";
import classes from "./edit-user.module.css";
import TextareaField from "../ui/textarea-field";
import Pfp from "../components/pfp";

export default function EditUser() {
  const [result, setResult] = useState<null | Record<string, unknown>>(null);

  const { user, updateUser } = useUser();
  const [pfpPreview, setPfpPreview] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (user?.pfp) {
      setPfpPreview(import.meta.env.VITE_STRAPI_HOST + user?.pfp?.url);
    }
  }, [user?.pfp]);

  function previewPfp(e: ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (files) {
      const file = files[0];
      if (file) {
        setPfpPreview(URL.createObjectURL(file));
      }
    }
  }

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
        <div className={classes.image}>
          <Pfp url={pfpPreview} pfp={user?.pfp} />
          <FileInput
            id="pfp"
            labelText="new pfp"
            type="file"
            accept="image/*"
            onChange={previewPfp}
          />
        </div>
        <InputField
          id="username"
          defaultValue={user?.username}
          error={zodErrors?.username}
        />
        <TextareaField
          id="bio"
          defaultValue={user?.bio}
          error={zodErrors?.bio}
          maxLength={255}
          rows={5}
        />
      </Form>
    </section>
  );
}
