import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Redirect } from "wouter";
import classes from "./edit-user.module.css";
import { useCurrentUser } from "../../lib/context-as-hooks";
import { updateUserAction } from "../../api/update-user-action";
import Form from "../../ui/form";
import Pfp from "../../components/pfp";
import FileInput from "../../ui/file-input";
import InputField from "../../ui/input-field";
import TextareaField from "../../ui/textarea-field";
import { User } from "../../types/user";

export default function EditUser() {
  const [result, setResult] = useState<null | Record<string, unknown>>(null);

  const { currentUser, updateCurrentUser } = useCurrentUser();
  const [pfpPreview, setPfpPreview] = useState<string>("/placeholder.svg");

  useEffect(() => {
    if (currentUser?.pfp) {
      setPfpPreview(import.meta.env.VITE_STRAPI_HOST + currentUser?.pfp?.url);
    }
  }, [currentUser?.pfp]);

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

    const pfp = currentUser?.pfp as { id?: string };
    setResult(await updateUserAction(e, pfp?.id));
  }

  const resultUser = result?.user as User | undefined;
  if (resultUser) {
    updateCurrentUser();
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
          <Pfp url={pfpPreview} pfp={currentUser?.pfp} />
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
          defaultValue={currentUser?.username}
          error={zodErrors?.username}
        />
        <TextareaField
          id="bio"
          defaultValue={currentUser?.bio}
          error={zodErrors?.bio}
          maxLength={255}
          rows={5}
        />
      </Form>
    </section>
  );
}
