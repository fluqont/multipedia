import { UserProvider } from "./context/user-context";
import Layout from "./pages/layout";

function App() {
  return (
    <UserProvider>
      <Layout />
    </UserProvider>
  );
}

export default App;
