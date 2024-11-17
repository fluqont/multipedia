import classes from "./tips.module.css";

export default function Tips() {
  return (
    <div>
      <p className={classes.p}>
        tip:{" "}
        <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank">
          learn markdown
        </a>{" "}
        to feel freedom
      </p>
      <p className={classes.p}>
        automatically saved to browser's storage every second
      </p>
    </div>
  );
}
