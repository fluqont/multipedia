import classes from "./new-article.module.css";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import SearchableSelect from "../../ui/searchable-select";
import { useEffect, useRef } from "react";

export default function NewArticle() {
  const dropdownItems = ["sss", "libertarianism", "no wait"];
  const timeoutRef = useRef<number>();
  function handleChange() {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      localStorage.setItem(
        "body",
        editorRef.current?.getInstance().getMarkdown()
      );
    }, 1000);
  }

  useEffect(() => {
    const body = localStorage.getItem("body");
    if (body) {
      editorRef.current?.getInstance().setMarkdown(body);
    }
  }, []);

  const editorRef = useRef<Editor>(null);

  return (
    <form className={classes.form}>
      <SearchableSelect id="topic" dropdownItems={dropdownItems} />
      <Editor
        previewStyle="tab"
        theme={
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
        }
        hideModeSwitch={true}
        onChange={handleChange}
        ref={editorRef}
        initialValue=" "
      />
    </form>
  );
}
