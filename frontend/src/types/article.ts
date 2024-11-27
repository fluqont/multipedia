import { MinimalUser } from "./user";

export interface Article {
  documentId: string;
  id: number;
  body: string;
  draft: boolean;
  topic: Topic;
  views: number;
}

export interface FullArticle extends Article {
  user: MinimalUser;
}

export interface ArticleWithDiffs extends Article {
  article_diffs: Record<string, string | number>[];
}

export interface Topic {
  id: number;
  title: string;
}

export interface Comment {
  documentId: string;
  id: number;
  body: string;
  user: MinimalUser;
}
