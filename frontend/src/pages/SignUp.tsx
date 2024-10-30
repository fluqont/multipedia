import Form from "../ui/Form";
import InputField from "../ui/InputField";
import atomics from "../atomics.module.css";
import { FormEvent, useState } from "react";
import { signUpAction } from "../actions/sign-up-action";
import { Redirect } from "wouter";
import { useUser } from "../lib/utils/context";

export default function SignUp() {
  const [result, setResult] = useState<null | Record<string, unknown>>(null);
  const { updateUser } = useUser();

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    setResult(await signUpAction(e));
    updateUser();
  }

  if (result?.user) {
    return <Redirect to="/" />;
  }

  return (
    <section className={atomics["centered-section"]}>
      <h1>sign up</h1>
      {/* @ts-expect-error even if message doesn't exist, error is not thrown */}
      <Form onSubmit={handleSignUp} error={result?.error?.message}>
        {/* @ts-expect-error even if message doesn't exist, error is not thrown */}
        <InputField id="username" error={result?.zodErrors?.username} />
        <InputField
          id="email"
          inputType="email"
          // @ts-expect-error even if message doesn't exist, error is not thrown
          error={result?.zodErrors?.email}
        />
        <InputField
          id="password"
          inputType="password"
          // @ts-expect-error even if message doesn't exist, error is not thrown
          error={result?.zodErrors?.password}
        />
      </Form>
    </section>
  );
}
