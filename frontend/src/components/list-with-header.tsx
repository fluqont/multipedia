import { HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import atomics from "../atomics.module.css";
import classes from "./list-with-header.module.css";

interface ListWithHeaderProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLElement> {
  headerLabel: string;
  additionalHeaderItems?: ReactNode;
}

export default function ListWithHeader({
  headerLabel,
  additionalHeaderItems,
  children,
  ...props
}: ListWithHeaderProps) {
  return (
    <figure {...props}>
      <div className={classes.header}>
        <h3 className={atomics.h3}>{headerLabel}</h3>
        {additionalHeaderItems}
      </div>
      <figcaption>{children}</figcaption>
    </figure>
  );
}
