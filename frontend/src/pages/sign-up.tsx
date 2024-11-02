import Form from "../ui/form";
import InputField from "../ui/input-field";
import atomics from "../atomics.module.css";
import { FormEvent, useState } from "react";
import { signUpAction } from "../lib/actions/sign-up-action";
import { Redirect } from "wouter";
import { useUser } from "../lib/utils/context-as-hooks";
import { User } from "../context/user-context";
import OAuth from "../components/oauth";
import Hr from "../ui/hr";

export default function SignUp() {
  const [result, setResult] = useState<null | Record<string, unknown>>(null);
  const { updateUser } = useUser();

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    setResult(await signUpAction(e));
    updateUser();
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
