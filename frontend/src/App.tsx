import { UserProvider } from "./context/user-contenxt";
import { Layout } from "./pages/layout";

function App() {
  return (
    <UserProvider>
      <Layout />
    </UserProvider>
  );
}

export default App;
