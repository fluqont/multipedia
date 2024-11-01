import atomics from "../atomics.module.css";

export default function OAuth() {
  return (
    <a
      href={import.meta.env.VITE_STRAPI_BASE_URL + "/connect/github/callback"}
      className={atomics["link-button"]}
    >
      sign in with GitHub
    </a>
  );
}
