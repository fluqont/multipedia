import classes from "./hr.module.css";

interface HrProps {
  label: string;
}

export default function Hr({ label }: HrProps) {
  return (
    <div className={classes.wrapper}>
      <hr className={classes.hr} />
      <p className={classes.label}>{label}</p>
    </div>
  );
}
