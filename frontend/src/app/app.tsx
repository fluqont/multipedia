import { UserProvider } from "../context/user-context";
import Header from "../components/header";
import atomics from "../atomics.module.css";
import { Link } from "wouter";
import { useUser } from "../lib/utils/context-as-hooks";
import Router from "./router";

export default function App() {
  const { user, updateUser } = useUser();
  function logOut() {
    localStorage.removeItem("jwt");
    updateUser();
  }
  return (
    <UserProvider>
      <Header rootLinkText="multipedia">
        {user ? (
          <>
            <Link href={`/users/${user.username}`}>{user.username}</Link>
            <button onClick={logOut} className="small">
              log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login">login</Link>
            <Link href="/sign-up" className={atomics["link-button"]}>
              sign up
            </Link>
          </>
        )}
      </Header>
      <main>
        <Router />
      </main>
    </UserProvider>
  );
}
