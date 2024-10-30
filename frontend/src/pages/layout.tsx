import Header from "../ui/header";
import atomics from "../atomics.module.css";
import { Route, Switch } from "wouter";
import SignUp from "./sign-up";
import { useUser } from "../lib/utils/context";

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
            <button onClick={logOut}>log out</button>
          </>
        ) : (
          <>
            <a href="/login">login</a>
            <a href="/sign-up" className={atomics["link-button"]}>
              sign up
            </a>
          </>
        )}
      </Header>
      <main>
        <Switch>
          <Route path="/sign-up" component={SignUp} />
          <Route>404: No such page!</Route>
        </Switch>
      </main>
    </>
  );
}
