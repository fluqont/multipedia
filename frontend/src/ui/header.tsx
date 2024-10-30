import { PropsWithChildren, ReactElement } from "react";
import classes from "./header.module.css";
import { Link } from "wouter";

interface HeaderProps extends PropsWithChildren {
  rootLinkText: string;
  children: ReactElement;
}

export default function Header({ rootLinkText, children }: HeaderProps) {
  return (
    <header className={classes.header}>
      <Link href="/" className={classes.logo}>
        {rootLinkText}
      </Link>
      <nav className={classes.nav}>{children}</nav>
    </header>
  );
}
