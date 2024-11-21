import { HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import classes from "./card.module.css";
import { cn } from "../lib/utils";

interface CardProps extends PropsWithChildren, HTMLAttributes<HTMLElement> {
  label: ReactNode;
  type?: "error";
}

export default function Card({ label, children, type, ...props }: CardProps) {
  return (
    <article
      {...props}
      className={cn([classes.card, type && classes[type], props.className])}
    >
      <p className={classes.title}>{label}</p>
      {children}
    </article>
  );
}
