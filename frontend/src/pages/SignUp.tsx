import Form from "../ui/Form";
import InputField from "../ui/InputField";
import atomics from "../atomics.module.css";
import { FormEvent, useState } from "react";
import { signUpAction } from "../actions/sign-up-action";

export default function SignUp() {
  const [result, setResult] = useState<null | Record<string, unknown>>(null);

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    setResult(await signUpAction(e));
  }

  return (
    <section className={atomics["centered-section"]}>
      <h1>sign up</h1>
      <Form onSubmit={handleSignUp} error={result?.error?.message}>
        <InputField id="username" />
        <InputField id="email" inputType="email" />
        <InputField id="password" inputType="password" />
      </Form>
    </section>
  );
}
