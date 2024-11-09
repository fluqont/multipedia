import InputField from "../../ui/input-field";
import classes from "./new-article.module.css";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";

export default function NewArticle() {
  return (
    <form className={classes.form}>
      <InputField id="topics" />
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
