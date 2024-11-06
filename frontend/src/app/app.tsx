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
            <Link href={`/users/${currentUser.username}`}>
              <Pfp
                url={currentUser.pfp ? currentUser.pfp.url : "/placeholder.svg"}
                size={40}
              />
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
