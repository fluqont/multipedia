import { MinimalUser } from "./user";

export interface Article {
  documentId: string;
  id: number;
  body: string;
  draft: boolean;
  topic: Topic;
  views: number;
}
export interface Topic {
  id: number;
  title: string;
}

export interface FullArticle extends Article {
  user: MinimalUser;
}

export interface Comment {
  documentId: string;
  id: number;
  body: string;
  user: MinimalUser;
}
