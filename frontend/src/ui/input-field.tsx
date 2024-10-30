import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import classes from "./input-field.module.css";
import atomics from "../atomics.module.css";
import { cn } from "../lib/utils/classes";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name?: string;
  labelText?: string;
  inputType?: HTMLInputTypeAttribute;
  error?: string;
}

export default function InputField({
  id,
  name = id,
  labelText = id,
  inputType = "text",
  error,
  ...props
}: InputFieldProps) {
  return (
    <div className={classes["input-field"]}>
      <label htmlFor={id} className={classes.label}>
        {labelText}
      </label>
      <input
        type={inputType}
        name={name}
        id={id}
        className={cn([classes.input, error && classes["input--error"]])}
        {...props}
      />
      {error && <p className={atomics.error}>{error}</p>}
    </div>
  );
}
