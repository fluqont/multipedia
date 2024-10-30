import Header from "../ui/header";
import atomics from "../atomics.module.css";
import { Link, Route, Switch } from "wouter";
import SignUp from "./sign-up";
import { useUser } from "../lib/utils/context";
import Login from "./login";
import Page404 from "./404";

export function Layout() {
  const { user, updateUser } = useUser();
  function logOut() {
    localStorage.removeItem("jwt");
    updateUser();
  }
  return (
    <>
      <Header rootLinkText="multipedia">
        {user ? (
          <>
            <p>{user.username}</p>
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
        <Switch>
          <Route path="/sign-up" component={SignUp} />
          <Route path="/login" component={Login} />
          <Route component={Page404} />
        </Switch>
      </main>
    </>
  );
}
