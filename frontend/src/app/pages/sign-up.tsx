import atomics from "../../atomics.module.css";
import { FormEvent, useState } from "react";
import { Redirect } from "wouter";
import { useCurrentUser } from "../../lib/context-as-hooks";
import Form from "../../ui/form";
import InputField from "../../ui/input-field";
import Hr from "../../ui/hr";
import OAuth from "../../components/oauth/oauth";
import { User } from "../../types/user";
import { signUpAction } from "../../api/sign-up-action";

export default function SignUp() {
  const [result, setResult] = useState<null | Record<string, unknown>>(null);
  const { updateCurrentUser } = useCurrentUser();

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    setResult(await signUpAction(e));
    updateCurrentUser();
  }

  const resultUser = result?.user as User | undefined;
  if (resultUser) {
    return <Redirect to={`/users/${resultUser.username}`} />;
  }

  const zodErrors = result?.zodErrors as Record<string, string> | undefined;
  return (
    <section className={atomics["centered-section"]}>
      <h1>sign up</h1>
      <Form
        onSubmit={handleSignUp}
        error={(result?.error as Record<string, string> | undefined)?.message}
      >
        <InputField id="username" error={zodErrors?.username} />
        <InputField id="email" type="email" error={zodErrors?.email} />
        <InputField id="password" type="password" error={zodErrors?.password} />
      </Form>
      <Hr label="Or continue with" />
      <OAuth />
    </section>
  );
}
