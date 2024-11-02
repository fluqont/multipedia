import { TextareaHTMLAttributes, useState } from "react";
import classes from "./any-field.module.css";
import { cn } from "../lib/cn";
import Field from "./base/field";

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  name?: string;
  labelText?: string;
  error?: string;
  maxLength: number;
}

export default function TextareaField({
  id,
  name = id,
  labelText = id,
  error,
  maxLength,
  defaultValue,
  ...props
}: TextareaFieldProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Field
      id={id}
      labelText={labelText}
      error={error}
      className={classes["textarea-wrapper"]}
    >
      <>
        <textarea
          name={name}
          id={id}
          className={cn([
            classes.input,
            classes.textarea,
            error && classes["input--error"],
          ])}
          maxLength={maxLength}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          {...props}
        />
        <div className={classes.length}>
          {typeof value !== "string" ? 0 : value?.length}/{maxLength}
        </div>
      </>
    </Field>
  );
}
