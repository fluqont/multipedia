import { Article } from "../types/article";
import { Nullable } from "./types";

export function getArticles(allArticles: Nullable<Article[]>) {
  const articles: Article[] = [],
    drafts: Article[] = [];
  if (!allArticles) {
    return { articles, drafts };
  }
  for (const article of allArticles) {
    if (
      article.draft &&
      drafts.findIndex((value) => value.topic.id === article.topic.id) === -1
    ) {
      drafts.push(article);
    } else if (
      !article.draft &&
      articles.findIndex((value) => value.topic.id === article.topic.id) === -1
    ) {
      articles.push(article);
    }
  }
  return { articles, drafts };
}
