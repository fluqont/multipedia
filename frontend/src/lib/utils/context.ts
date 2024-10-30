import { useContext } from "react";
import { UserContext } from "../../context/user-contenxt";

export const useUser = () => useContext(UserContext);
