import { Editor } from "@toast-ui/react-editor";
import { ForwardedRef, forwardRef, memo, useRef } from "react";
import { getColorScheme } from "../lib/utils";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";

interface CustomEditorProps {
  initialValue: string;
}

const CustomEditor = memo(
  forwardRef(
    ({ initialValue }: CustomEditorProps, ref: ForwardedRef<Editor>) => {
      const timeoutRef = useRef<number>();
      function handleChange() {
        clearTimeout(timeoutRef.current);
        if (ref && "current" in ref) {
          timeoutRef.current = setTimeout(() => {
            localStorage.setItem(
              "body",
              ref.current?.getInstance().getMarkdown()
            );
          }, 1000);
        }
      }
      return (
        <Editor
          previewStyle="tab"
          theme={getColorScheme()}
          hideModeSwitch={true}
          onChange={handleChange}
          ref={ref}
          initialValue={initialValue}
        />
      );
    }
  )
);
export default CustomEditor;
