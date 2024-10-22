import Header from "./ui/Header";
import atomics from "./atomics.module.css";

function App() {
  return (
    <Header rootLinkText="multipedia">
      <a href="/login">login</a>
      <a href="/sign-up" className={atomics["link-button"]}>
        sign up
      </a>
    </Header>
  );
}

export default App;
