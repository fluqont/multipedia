export interface MinimalUser {
  documentId: string;
  id: number;
  username: string;
  pfp?: {
    url: string;
  };
}

export interface User extends MinimalUser {
  bio?: string;
  pfp?: {
    id: string;
    url: string;
  };
}

export interface UserWithFriends extends User {
  incoming?: MinimalUser[];
  outcoming?: MinimalUser[];
}
