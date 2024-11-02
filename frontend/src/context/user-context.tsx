import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { getUser } from "../lib/actions/get-user";
import { MinimalUser } from "../lib/utils/get-friends";

export interface User {
  id: number;
  username: string;
  bio?: string;
  pfp?: {
    id: string;
    url: string;
  };
  incoming: MinimalUser[];
  outcoming: MinimalUser[];
}

export const UserContext = createContext<{
  user: User | null;
  updateUser: () => void;
}>({ user: null, updateUser: () => undefined });

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<null | User>(null);

  const updateUser = async () => setUser(await getUser());

  useEffect(() => {
    updateUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}
