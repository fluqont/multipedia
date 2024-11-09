import { PropsWithChildren } from "react";
import classes from "./field.module.css";
import atomics from "../../atomics.module.css";
import { cn } from "../../lib/cn";

interface FieldProps extends PropsWithChildren {
  id: string;
  labelText: string;
  error?: string[] | false | null;
  className?: string;
}

export default function Field({
  id,
  labelText,
  children,
  error,
  className,
}: FieldProps) {
  return (
    <div className={cn([classes["input-field"], className])}>
      <label htmlFor={id} className={classes.label}>
        {labelText}
      </label>
      {children}
      {error && <p className={atomics.error}>{error}</p>}
    </div>
  );
}
