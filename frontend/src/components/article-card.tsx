import { Link } from "wouter";
import Card from "../ui/card";
import Pfp from "./pfp";
import ArticleStats from "./article-stats";
import { Article, FullArticle } from "../types/article";
import classes from "./article-card.module.css";
import { HTMLAttributes } from "react";

interface ArticleCardProps extends HTMLAttributes<HTMLElement> {
  article: FullArticle | Article;
  username?: string;
  user?: boolean;
}

export default function ArticleCard({
  article,
  username,
  user = true,
  ...props
}: ArticleCardProps) {
  return (
    <Card
      label={
        <Link
          href={`/users/${
            username ?? (article as FullArticle).user.username
          }/articles/${article.topic.title}`}
        >
          {article.topic.title}
        </Link>
      }
      {...props}
    >
      {user && (
        <Link
          href={`/users/${(article as FullArticle).user.username}`}
          className={classes["user-profile"]}
        >
          <Pfp size={32} pfp={(article as FullArticle).user.pfp} />
          {(article as FullArticle).user.username}
        </Link>
      )}
      <ArticleStats isArticleFetched={true} article={article} action={false} />
    </Card>
  );
}
