import { FormHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import classes from "./form.module.css";
import atomics from "../atomics.module.css";
import { InputError } from "../types/fetch";

interface FormProps
  extends PropsWithChildren,
    FormHTMLAttributes<HTMLFormElement> {
  submitLabel?: string;
  additionalButtons?: ReactNode;
  error?: InputError;
  loading: boolean;
}

export default function Form({
  children,
  submitLabel = "submit",
  additionalButtons,
  error,
  loading,
  ...props
}: FormProps) {
  return (
    <form className={classes.form} noValidate {...props}>
      <section className={classes["form-body"]}>
        {error && <p className={atomics.error}>{error}</p>}
        {children}
      </section>
      <section className={classes["form-buttons"]}>
        <button type="submit" disabled={loading}>
          {submitLabel}
        </button>
        {additionalButtons}
      </section>
    </form>
  );
}
