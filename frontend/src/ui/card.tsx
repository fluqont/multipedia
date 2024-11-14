import { PropsWithChildren, ReactNode } from "react";
import classes from "./card.module.css";

interface CardProps extends PropsWithChildren {
  title: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <article className={classes.card}>
      <p className={classes.title}>{title}</p>
      {children}
    </article>
  );
}
