import Form from "../ui/form";
import InputField from "../ui/input-field";
import atomics from "../atomics.module.css";
import { FormEvent, useState } from "react";
import { Redirect } from "wouter";
import { useUser } from "../lib/utils/context";
import { loginAction } from "../lib/actions/login-action";
import { User } from "../context/user-context";

export default function Login() {
  const [result, setResult] = useState<null | Record<string, unknown>>(null);
  const { updateUser } = useUser();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setResult(await loginAction(e));
    updateUser();
  }

  const resultUser = result?.user as User | undefined;
  if (resultUser) {
    return <Redirect to={`/users/${resultUser.username}`} />;
  }

  const zodErrors = result?.zodErrors as Record<string, string> | undefined;
  return (
    <section className={atomics["centered-section"]}>
      <h1>login</h1>
      <Form
        onSubmit={handleLogin}
        error={(result?.error as Record<string, string> | undefined)?.message}
      >
        <InputField
          id="identifier"
          error={zodErrors?.identifier}
          labelText="email or username"
        />
        <InputField id="password" type="password" error={zodErrors?.password} />
      </Form>
    </section>
  );
}
