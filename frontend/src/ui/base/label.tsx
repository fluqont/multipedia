import classes from "./label.module.css";

interface LabelProps {
  id: string;
  labelText: string;
}

export default function Label({ id, labelText }: LabelProps) {
  return (
    <label htmlFor={id} className={classes.label}>
      {labelText}
    </label>
  );
}
