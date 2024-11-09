import { FormHTMLAttributes, PropsWithChildren } from "react";
import classes from "./form.module.css";
import atomics from "../atomics.module.css";

export default function Form({
  children,
  error,
  loading,
  ...props
}: PropsWithChildren & {
  error?: string | false | null;
  loading: boolean;
} & FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form className={classes.form} noValidate {...props}>
      <section className={classes["form-body"]}>
        {error && <p className={atomics.error}>{error}</p>}
        {children}
      </section>
      <section>
        <button type="submit" disabled={loading}>
          submit
        </button>
      </section>
    </form>
  );
}
