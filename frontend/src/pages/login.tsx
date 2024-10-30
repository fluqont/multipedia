import Form from "../ui/form";
import InputField from "../ui/input-field";
import atomics from "../atomics.module.css";
import { FormEvent, useState } from "react";
import { Redirect } from "wouter";
import { useUser } from "../lib/utils/context";
import { loginAction } from "../lib/actions/login-action";

export default function Login() {
  const [result, setResult] = useState<null | Record<string, unknown>>(null);
  const { updateUser } = useUser();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setResult(await loginAction(e));
    updateUser();
  }

  if (result?.user) {
    return <Redirect to="/" />;
  }

  return (
    <section className={atomics["centered-section"]}>
      <h1>login</h1>
      {/* @ts-expect-error even if message doesn't exist, error is not thrown */}
      <Form onSubmit={handleLogin} error={result?.error?.message}>
        <InputField
          id="identifier"
          // @ts-expect-error even if message doesn't exist, error is not thrown
          error={result?.zodErrors?.identifier}
          labelText="email or username"
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
