import { Article } from "../types/article";
import Like from "./like";
import classes from "./article-stats.module.css";
import atomics from "../atomics.module.css";

interface ArticleStatsProps {
  isArticleFetched: boolean;
  article: Article;
  action?: boolean;
}

export default function ArticleStats({
  isArticleFetched,
  article,
  action = true,
}: ArticleStatsProps) {
  return (
    <div className={classes["article-stats"]}>
      <Like
        documentId={article.documentId}
        isArticleFetched={isArticleFetched}
        action={action}
      />
      <div aria-label="views" className={atomics["icon-button"]}>
        <img src="/view.svg" width={24} height={24} alt="" />
        {article.views}
      </div>
    </div>
  );
}
