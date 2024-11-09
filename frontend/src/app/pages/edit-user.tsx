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
import { StrapiError } from "../../types/fetch";

export default function EditUser() {
  const [result, setResult] = useState<null | User | StrapiError>(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    const pfp = currentUser?.pfp as { id?: string };
    setResult(await updateUserAction(e, pfp?.id));
  }

  if (result && loading) {
    setLoading(false);
  }

  if (result && "id" in result) {
    updateCurrentUser();
    return <Redirect to={`/users/${result.username}`} />;
  }

  const zodErrors = result && "zodErrors" in result && result.zodErrors;
  return (
    <section>
      <Form
        error={result && "error" in result && result.error}
        onSubmit={handleEdit}
        loading={loading}
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
          error={zodErrors && zodErrors?.username}
        />
        <TextareaField
          id="bio"
          defaultValue={currentUser?.bio ?? undefined}
          error={zodErrors && zodErrors?.bio}
          maxLength={255}
          rows={5}
        />
      </Form>
    </section>
  );
}
