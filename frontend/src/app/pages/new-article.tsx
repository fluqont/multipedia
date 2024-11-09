import classes from "./new-article.module.css";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import SearchableSelect from "../../ui/searchable-select";
import { useState } from "react";

export default function NewArticle() {
  const [dropdownItems, setDropdownItems] = useState([
    "sss",
    "libertarianism",
    "no wait",
  ]);
  return (
    <form className={classes.form}>
      <SearchableSelect
        id="topic"
        dropdownItems={dropdownItems}
        onCreateClick={(value) => setDropdownItems([...dropdownItems, value])}
      />
      <Editor
        previewStyle="tab"
        theme={
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
        }
        hideModeSwitch={true}
        initialValue=" "
      />
    </form>
  );
}
