import Toggle from "../../ui/toggle";
import classes from "./new-article.module.css";

export default function NewArticle() {
  return (
    <div className={classes["test-form"]}>
      <nav className={classes.nav}>
        <div className={classes.decorators}>
          <Toggle id="bold" title="bold">
            <b>B</b>
          </Toggle>
          <Toggle id="italic" title="italic">
            <i>I</i>
          </Toggle>
          <Toggle id="underline" title="underline">
            <span style={{ textDecoration: "underline" }}>U</span>
          </Toggle>
          <Toggle id="highlight" title="highlight">
            <Icon src="/highlight.svg" />
          </Toggle>
        </div>
        <div className={classes.heading}>
          <Toggle id="first" name="heading" title="first heading" type="radio">
            H1
          </Toggle>
          <Toggle
            id="second"
            name="heading"
            title="second heading"
            type="radio"
          >
            H2
          </Toggle>
          <Toggle id="third" name="heading" title="third heading" type="radio">
            H3
          </Toggle>
        </div>
        <div>
          <Toggle id="bulleted" name="list" title="bulleted list" type="radio">
            <Icon src="/bulleted-list.svg" />
          </Toggle>
          <Toggle id="numbered" name="list" title="numbered list" type="radio">
            <Icon src="/numbered-list.svg" />
          </Toggle>
          <Toggle id="checklist" name="list" title="checklist" type="radio">
            <Icon src="/checklist.svg" />
          </Toggle>
        </div>
        {/* TODO: change to checkbox */}
      </nav>
      <textarea
        id="body"
        name="body"
        placeholder="body"
        aria-label="body"
        className={classes.title}
        rows={25}
      />
    </div>
  );
}

function Icon({ src }: { src: string }) {
  return <img src={src} alt="" width={20} height={20} />;
}
