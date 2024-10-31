import atomics from "../atomics.module.css";
import classes from "./error-page.module.css";
import { cn } from "../lib/utils/classes";
import { Link } from "wouter";

interface ErrorPageProps {
  children?: string;
  errorCode?: number;
}

export default function ErrorPage({
  children = "Page not found",
  errorCode = 404,
}: ErrorPageProps) {
  return (
    <section className={cn([atomics["centered-section"], classes.section])}>
      <h1 className={classes.h1}>{errorCode}</h1>
      <p className={classes.p}>{children}</p>
      <nav className={classes.nav}>
        <Link href="/">home</Link>
        <Link href="/" onClick={() => history.back()}>
          go back
        </Link>
      </nav>
    </section>
  );
}
