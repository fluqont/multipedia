import atomics from "../../atomics.module.css";
import { FormEvent, useState } from "react";
import { Redirect } from "wouter";
import { loginAction } from "../../api/login-action";
import { useCurrentUser } from "../../lib/context-as-hooks";
import Form from "../../ui/form";
import InputField from "../../ui/input-field";
import Hr from "../../ui/hr";
import OAuth from "../../components/oauth/oauth";
import { User } from "../../types/user";

export default function Login() {
  const [result, setResult] = useState<null | Record<string, unknown>>(null);
  const { updateCurrentUser } = useCurrentUser();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setResult(await loginAction(e));
    updateCurrentUser();
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
          labelText="email or username"
          autoComplete="email username"
          error={zodErrors?.identifier}
        />
        <InputField
          id="password"
          type="password"
          autoComplete="current-password"
          error={zodErrors?.password}
        />
      </Form>
      <Hr label="Or continue with" />
      <OAuth />
    </section>
  );
}
