import { InputHTMLAttributes } from "react";
import classes from "./file-input.module.css";

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name?: string;
  labelText?: string;
}

export default function FileInput({
  id,
  name = id,
  labelText = id,
  ...props
}: FileInputProps) {
  return (
    <>
      <label htmlFor={id} className={classes.label}>
        {labelText}
      </label>
      <input name={name} id={id} className={classes.input} {...props} />
    </>
  );
}
