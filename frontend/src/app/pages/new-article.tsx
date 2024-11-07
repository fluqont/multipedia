import classes from "./new-article.module.css";

export default function NewArticle() {
  return (
    <div className={classes["test-form"]}>
      <nav className={classes.nav}>
        <div className={classes.decorators}>
          <button aria-label="bold">
            <b>B</b>
          </button>
          <button aria-label="italic">
            <i>I</i>
          </button>
          <button aria-label="underline">
            <span style={{ textDecoration: "underline" }}>U</span>
          </button>
          <button title="highlight">
            <Icon src="/highlight.svg" />
          </button>
        </div>
        <div className={classes.heading}>
          <button title="first heading">H1</button>
          <button title="second heading">H2</button>
          <button title="third heading">H3</button>
        </div>
        <div>
          <button title="bulleted list">
            <Icon src="/bulleted-list.svg" />
          </button>
          <button title="numbered list">
            <Icon src="/numbered-list.svg" />
          </button>
          <button title="checklist">
            <Icon src="/checklist.svg" />
          </button>
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
