import { useContext } from "react";
import { CurrentUserContext } from "../context/user-context";

export const useCurrentUser = () => useContext(CurrentUserContext);
