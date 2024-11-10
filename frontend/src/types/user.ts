import { Article } from "./article";

export interface MinimalUser {
  documentId: string;
  id: number;
  username: string;
  pfp?: {
    id: string;
    url: string;
  };
}

export interface User extends MinimalUser {
  bio?: string;
}

export interface UserWithFriends extends User {
  incoming: MinimalUser[];
  outcoming: MinimalUser[];
}

export interface FullUser extends UserWithFriends {
  articles: Article[];
}
