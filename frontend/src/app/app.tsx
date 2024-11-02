import { UserProvider } from "../context/user-context";
import Header from "../components/header";
import atomics from "../atomics.module.css";
import { Link } from "wouter";
import { useCurrentUser } from "../lib/context-as-hooks";
import Router from "./router";

export default function App() {
  const { currentUser, updateCurrentUser } = useCurrentUser();
  function logOut() {
    localStorage.removeItem("jwt");
    updateCurrentUser();
  }
  return (
    <UserProvider>
      <Header rootLinkText="multipedia">
        {currentUser ? (
          <>
            <Link href={`/users/${currentUser.username}`}>
              {currentUser.username}
            </Link>
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
