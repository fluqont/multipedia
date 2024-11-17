import { Route, Switch } from "wouter";
import SignUp from "./pages/sign-up";
import Login from "./pages/login";
import SearchPage from "./pages/search-page";
import ManageFriends from "./pages/manage-friends";
import UserProfilePage from "./pages/user-profile-page";
import EditUser from "./pages/edit-user";
import OAuthRedirect from "./pages/oauth-redirect";
import Page404 from "./pages/404";
import ConfirmationSubmit from "./pages/confirmation-submit";
import ConfirmationMessage from "./pages/confirmation-message";
import NewConfirmationRequest from "./pages/new-confirmation-request";
import NewArticle from "./pages/new-article";
import Article from "./pages/article";
import ManageArticles from "./pages/manage-articles";
import EditArticle from "./pages/edit-article";

export default function Router() {
  return (
    <Switch>
      <Route path="/sign-up" component={SignUp} />
      <Route path="/confirmation/message" component={ConfirmationMessage} />
      <Route path="/login" component={Login} />
      <Route path="/confirmation/submit" component={ConfirmationSubmit} />
      <Route
        path="/confirmation/new-request"
        component={NewConfirmationRequest}
      />
      <Route path="/connect/:provider/redirect" component={OAuthRedirect} />
      <Route path="/users/me/friends/manage" component={ManageFriends} />
      <Route path="/users/me/articles/manage" component={ManageArticles} />
      <Route path="/users/me/edit" component={EditUser} />
      <Route path="/users/:username" component={UserProfilePage} />
      <Route path="/users/:username/articles/:topic" component={Article} />
      <Route
        path="/users/:username/articles/:topic/edit"
        component={EditArticle}
      />
      <Route path="/articles/new" component={NewArticle} />
      <Route path="/search" component={SearchPage} />
      <Route component={Page404} />
    </Switch>
  );
}
