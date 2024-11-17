import { PropsWithChildren, ReactNode } from "react";
import classes from "./card.module.css";
import { cn } from "../lib/utils";

interface CardProps extends PropsWithChildren {
  title: ReactNode;
  type?: "error";
}

export default function Card({ title, children, type }: CardProps) {
  return (
    <article className={cn([classes.card, type && classes[type]])}>
      <p className={classes.title}>{title}</p>
      {children}
    </article>
  );
}
