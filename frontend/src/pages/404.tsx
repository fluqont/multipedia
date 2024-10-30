import atomics from "../atomics.module.css";
import classes from "./404.module.css";
import { cn } from "../lib/utils/classes";
import { Link } from "wouter";

export default function Page404() {
  return (
    <section className={cn([atomics["centered-section"], classes.section])}>
      <h1 className={classes.h1}>404</h1>
      <p className={classes.p}>Page not found</p>
      <nav className={classes.nav}>
        <Link href="/">home</Link>
        <Link href="/" onClick={() => history.back()}>
          go back
        </Link>
      </nav>
    </section>
  );
}
