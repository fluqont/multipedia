import OAuthProvider from "./oauth-provider";
import classes from "./oauth.module.css";

export default function OAuth() {
  return (
    <nav className={classes.nav}>
      <OAuthProvider label="google" />
      <OAuthProvider label="github" />
      <OAuthProvider label="discord" />
    </nav>
  );
}
