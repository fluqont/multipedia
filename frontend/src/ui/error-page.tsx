import atomics from "../atomics.module.css";
import classes from "./error-page.module.css";
import { cn } from "../lib/utils/cn";
import { Link } from "wouter";

interface ErrorPageProps {
  children?: string;
  error?: number | string;
  showBack?: boolean;
}

export default function ErrorPage({
  children = "Page not found",
  error = 404,
  showBack = true,
}: ErrorPageProps) {
  return (
    <section className={cn([atomics["centered-section"], classes.section])}>
      <h1 className={classes.h1}>{error}</h1>
      <p className={classes.p}>{children}</p>
      <nav className={classes.nav}>
        <Link href="/">home</Link>
        <Link href="/" onClick={() => history.back()}>
          {showBack && "go back"}
        </Link>
      </nav>
    </section>
  );
}
