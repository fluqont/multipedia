import { InputHTMLAttributes, PropsWithChildren } from "react";
import classes from "./toggle.module.css";

interface ToggleProps
  extends PropsWithChildren,
    InputHTMLAttributes<HTMLInputElement> {
  id: string;
  type?: "checkbox" | "radio";
  name?: string;
  title?: string;
}

export default function Toggle({
  id,
  name = id,
  title,
  type = "checkbox",
  children,
  ...props
}: ToggleProps) {
  // function handleCheck(e: MouseEvent<HTMLInputElement>) {
  //   if (e.currentTarget.type !== "radio") return;

  //   if (e.currentTarget.dataset.clicked === "true") {
  //     e.currentTarget.checked = false;
  //     e.currentTarget.dataset.clicked = "false";
  //   } else {
  //     e.currentTarget.dataset.clicked = "true";
  //   }
  // }
  return (
    <div className={classes["toggle-wrapper"]}>
      <input
        type={type}
        id={id}
        value={id}
        name={name}
        title={title}
        className={classes.checkbox}
        {...props}
      />
      <div className={classes["toggle-children"]}>{children}</div>
    </div>
  );
}
