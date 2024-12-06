import { memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import classes from "./custom-markdown.module.css";

const CustomMarkdown = memo(({ children }: { children: string }) => {
  return (
    <Markdown
      components={{
        h1: "h2",
        h2: "h3",
        h3: "h4",
        h4: "h5",
        h5: "h6",
      }}
      remarkPlugins={[remarkGfm]}
      className={classes.markdown}
    >
      {children}
    </Markdown>
  );
});
export default CustomMarkdown;
