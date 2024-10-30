import { FormHTMLAttributes, PropsWithChildren } from "react";
import classes from "./form.module.css";
import atomics from "../atomics.module.css";

export default function Form({
  children,
  error,
  ...props
}: PropsWithChildren & {
  error: string | null;
} & FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form className={classes.form} {...props}>
      <section className={classes["form-body"]}>{children}</section>
      <section>
        <button type="submit">submit</button>
        {error && <p className={atomics.error}>{error}</p>}
      </section>
    </form>
  );
}
