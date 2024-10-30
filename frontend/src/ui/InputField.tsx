import { HTMLInputTypeAttribute } from "react";
import classes from "./InputField.module.css";
import atomics from "../atomics.module.css";

interface InputFieldProps {
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
}: InputFieldProps) {
  return (
    <div className={classes["input-field"]}>
      <label htmlFor={id} className={classes.label}>
        {labelText}
      </label>
      <input type={inputType} name={name} id={id} className={classes.input} />
      {error && <p className={atomics.error}>{error}</p>}
    </div>
  );
}
