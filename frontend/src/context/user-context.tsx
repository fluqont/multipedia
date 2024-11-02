import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { getUser } from "../api/get-current-user";
import { User, UserWithFriends } from "../types/user";

export const CurrentUserContext = createContext<{
  currentUser: UserWithFriends | null;
  updateCurrentUser: () => void;
}>({ currentUser: null, updateCurrentUser: () => undefined });

export function UserProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<null | User>(null);

  const updateCurrentUser = async () => setCurrentUser(await getUser());

  useEffect(() => {
    updateCurrentUser();
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUser, updateCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}
