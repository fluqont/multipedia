import atomics from "../../atomics.module.css";
import { FormEvent, useState } from "react";
import { Link, Redirect } from "wouter";
import { loginAction } from "../../api/login-action";
import { useCurrentUser } from "../../lib/context-as-hooks";
import Form from "../../ui/form";
import InputField from "../../ui/input-field";
import Hr from "../../ui/hr";
import OAuth from "../../components/oauth/oauth";
import { User } from "../../types/user";
import { StrapiError } from "../../types/fetch";

export default function Login() {
  const [result, setResult] = useState<null | { user: User } | StrapiError>(
    null
  );
  const { updateCurrentUser } = useCurrentUser();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setResult(await loginAction(e));
    updateCurrentUser();
  }

  if (result && "user" in result) {
    return <Redirect to={`/users/${result.user.username}`} />;
  }

  const zodErrors = result && "zodErrors" in result && result.zodErrors;
  return (
    <section className={atomics["centered-section"]}>
      <h1>login</h1>
      <Form
        onSubmit={handleLogin}
        error={result && "error" in result && result.error}
      >
        <InputField
          id="identifier"
          labelText="email or username"
          autoComplete="email username"
          error={zodErrors && zodErrors?.identifier}
        />
        <InputField
          id="password"
          type="password"
          autoComplete="current-password"
          error={zodErrors && zodErrors.password}
        />
      </Form>
      {result &&
        "error" in result &&
        result.error === "Your account email is not confirmed" && (
          <Link href="/confirmation/new-request">
            Resend the confirmation email.
          </Link>
        )}
      <Hr label="Or continue with" />
      <OAuth />
    </section>
  );
}
