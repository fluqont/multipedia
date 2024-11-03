import { InputHTMLAttributes } from "react";
import classes from "./any-field.module.css";
import { cn } from "../lib/cn";
import Field from "./base/field";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name?: string;
  labelText?: string;
  error?: string | false | null;
}

export default function InputField({
  id,
  name = id,
  labelText = id,
  error,
  ...props
}: InputFieldProps) {
  return (
    <Field id={id} labelText={labelText} error={error}>
      <input
        name={name}
        id={id}
        className={cn([classes.input, error && classes["input--error"]])}
        {...props}
      />
    </Field>
  );
}
