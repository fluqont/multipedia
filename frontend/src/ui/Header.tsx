import { PropsWithChildren, ReactElement } from "react";
import classes from "./Header.module.css";

interface HeaderProps extends PropsWithChildren {
  rootLinkText: string;
  children: ReactElement[];
}

export default function Header({ rootLinkText, children }: HeaderProps) {
  return (
    <header className={classes.header}>
      <a href="/" className={classes.logo}>
        {rootLinkText}
      </a>
      <nav className={classes.nav}>{children.map((navLink) => navLink)}</nav>
    </header>
  );
}
