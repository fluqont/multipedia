import { useContext } from "react";
import { UserContext } from "../../context/user-context";

export const useUser = () => useContext(UserContext);
