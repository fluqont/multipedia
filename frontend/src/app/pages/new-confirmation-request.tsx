import { FormEvent, useState } from "react";
import Form from "../../ui/form";
import InputField from "../../ui/input-field";
import { StrapiError } from "../../types/fetch";
import { newConfirmationRequestAction } from "../../api/new-confirmation-request-action";
import { useLocation } from "wouter";
import atomics from "../../atomics.module.css";

export default function NewConfirmationRequest() {
  const [result, setResult] = useState<null | StrapiError | { email: string }>(
    null
  );
  async function handleConfirmationRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(
      await newConfirmationRequestAction(new FormData(e.currentTarget))
    );
  }

  const [, setLocation] = useLocation();
  if (result && "error" in result && result.error === "Already confirmed") {
    setLocation("/confirmation/message");
  }

  return (
    <section>
      <h1 className={atomics["form-title"]}>Confirmation request</h1>
      <Form
        onSubmit={handleConfirmationRequest}
        error={result && "error" in result && result.error}
        loading={false}
      >
        <InputField
          id="email"
          type="email"
          error={result && "zodErrors" in result && result.zodErrors.email}
        />
      </Form>
    </section>
  );
}
