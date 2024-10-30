import Header from "../ui/Header";
import atomics from "../atomics.module.css";
import { Route, Switch } from "wouter";
import SignUp from "./SignUp";
import { useUser } from "../lib/utils/context";

export function Layout() {
  const { user } = useUser();
  return (
    <>
      <Header rootLinkText="multipedia">
        {user ? (
          <>
            <p>{user.username}</p>
            <button>log out</button>
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
