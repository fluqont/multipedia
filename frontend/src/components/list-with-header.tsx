import { PropsWithChildren, ReactNode } from "react";
import atomics from "../atomics.module.css";

interface ListWithHeaderProps extends PropsWithChildren {
  headerLabel: string;
  additionalHeaderItems?: ReactNode;
}

export default function ListWithHeader({
  headerLabel,
  additionalHeaderItems,
  children,
}: ListWithHeaderProps) {
  return (
    <figure>
      <div>
        <h3 className={atomics.h3}>{headerLabel}</h3>
        {additionalHeaderItems}
      </div>
      <figcaption>{children}</figcaption>
    </figure>
  );
}
