import { Route, Switch } from "wouter";
import SignUp from "./pages/sign-up";
import Login from "./pages/login";
import SearchPage from "./pages/search-page";
import ManageFriends from "./pages/manage-friends";
import UserProfilePage from "./pages/user-profile-page";
import EditUser from "./pages/edit-user";
import OAuthRedirect from "../components/oauth/oauth-redirect";
import Page404 from "./pages/404";

export default function Router() {
  return (
    <Switch>
      <Route path="/sign-up" component={SignUp} />
      <Route path="/login" component={Login} />
      <Route path="/search" component={SearchPage} />
      <Route path="/users/:username" component={UserProfilePage} />
      <Route path="/users/me/friends/manage" component={ManageFriends} />
      <Route path="/users/me/edit" component={EditUser} />
      <Route path="/connect/:provider/redirect" component={OAuthRedirect} />
      <Route component={Page404} />
    </Switch>
  );
}
