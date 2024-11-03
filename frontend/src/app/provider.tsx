import { PropsWithChildren } from "react";
import { UserProvider } from "../context/user-context";

export default function Provider({ children }: PropsWithChildren) {
  return <UserProvider>{children}</UserProvider>;
}
