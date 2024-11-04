import { Link, useLocation } from "wouter";
import ErrorPage from "../../ui/error-page";
import { useEffect, useState } from "react";
import { emailConfirmationAction } from "../../api/email-confirmation-action";
import { StrapiError } from "../../types/fetch";

export default function ConfirmationSubmit() {
  const [location] = useLocation();
  const confirmationToken = new URL(location).searchParams.get("confirmation");
  const [result, setResult] = useState<null | StrapiError>(null);

  useEffect(() => {
    async function asyncFetch() {
      setResult(await emailConfirmationAction(confirmationToken));
    }
    if (confirmationToken) {
      asyncFetch();
    }
  }, [confirmationToken]);

  if (!confirmationToken) {
    return <ErrorPage error={400}>Token is not valid</ErrorPage>;
  }

  if (result && "error" in result) {
    return <ErrorPage error={result.errorCode}>{result.error}</ErrorPage>;
  }

  return (
    <ErrorPage error="Email confirmed">
      Your email was successfully verified. You can now{" "}
      <Link href="/login">login</Link>
    </ErrorPage>
  );
}
