import { PropsWithChildren } from "react";
import classes from "./Form.module.css";

export default function Form({ children }: PropsWithChildren) {
  return (
    <form className={classes.form}>
      <section className={classes["form-body"]}>{children}</section>
      <section>
        <button type="submit">submit</button>
      </section>
    </form>
  );
}
