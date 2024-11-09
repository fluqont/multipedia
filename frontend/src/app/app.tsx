import Header from "../components/header";
import atomics from "../atomics.module.css";
import { Link } from "wouter";
import { useCurrentUser } from "../lib/context-as-hooks";
import Router from "./router";
import Pfp from "../components/pfp";

export default function App() {
  const { currentUser, updateCurrentUser } = useCurrentUser();
  function logOut() {
    localStorage.removeItem("jwt");
    updateCurrentUser();
  }
  return (
    <>
      <Header rootLinkText="multipedia">
        {currentUser ? (
          <>
            <Link href="/articles/new" className={atomics["text-as-icon"]}>
              +
            </Link>
            <Link href={`/users/${currentUser.username}`}>
              <Pfp pfp={currentUser?.pfp} size={40} />
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
    </>
  );
}
