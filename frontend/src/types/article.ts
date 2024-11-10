export interface Article {
  documentId: string;
  id: number;
  body: string;
  draft: boolean;
  topic: Topic;
}
export interface Topic {
  id: number;
  title: string;
}
