import Markdown from "react-markdown";
import Form from "../../ui/form";
import InputField from "../../ui/input-field";
import TextareaField from "../../ui/textarea-field";
import classes from "./new-article.module.css";
import { useState } from "react";
import remarkGfm from "remark-gfm";

export default function NewArticle() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState("");
  return (
    <Form>
      {/* TODO: replace with topic */}
      <InputField id="title" />
      <div style={{ marginTop: "1rem" }}>
        <input
          checked={showPreview}
          onChange={() => setShowPreview(!showPreview)}
          id="show-preview"
          name="show-preview"
          type="checkbox"
        />
        <label htmlFor="show-preview">show preview</label>
      </div>
      {showPreview ? (
        <Markdown
          remarkPlugins={[remarkGfm]}
          disallowedElements={["h4", "h5", "h6", "hr"]}
          components={{ h1: "h2", h2: "h3", h3: "h4" }}
          className={classes.article}
        >
          {markdown}
        </Markdown>
      ) : (
        <TextareaField
          value={markdown}
          onChange={(e) => setMarkdown(e.currentTarget.value)}
          id="body"
          maxLength={100000}
          rows={12}
        />
      )}
    </Form>
  );
}
