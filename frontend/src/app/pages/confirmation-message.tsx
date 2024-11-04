import { Link } from "wouter";
import ErrorPage from "../../ui/error-page";

export default function ConfirmationMessage() {
  return (
    <ErrorPage error="Please, confirm your email">
      We sent you an email with a confirmation link. Please open this email and
      click the link to confirm your Multipedia account and email.
      <br />
      <Link href="/confirmation/new-request">Send new confirmation email</Link>
    </ErrorPage>
  );
}
