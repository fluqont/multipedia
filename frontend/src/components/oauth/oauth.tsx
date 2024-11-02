import OAuthProvider from "./oauth-provider";
import classes from "./oauth.module.css";

export default function OAuth() {
  return (
    <nav className={classes.nav}>
      <OAuthProvider label="github" />
    </nav>
  );
}
