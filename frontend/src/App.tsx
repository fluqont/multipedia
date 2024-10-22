import Header from "./ui/Header";
import atomics from "./atomics.module.css";
import { Route, Switch } from "wouter";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <>
      <Header rootLinkText="multipedia">
        <a href="/login">login</a>
        <a href="/sign-up" className={atomics["link-button"]}>
          sign up
        </a>
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

export default App;
