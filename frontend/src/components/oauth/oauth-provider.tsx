import atomics from "../../atomics.module.css";

interface OAuthProviderProps {
  label: string;
}

export default function OAuthProvider({ label }: OAuthProviderProps) {
  return (
    <a
      href={import.meta.env.VITE_STRAPI_BASE_URL + `/connect/${label}`}
      className={atomics["link-button"]}
      aria-label={`sign in with ${label}`}
    >
      <img src={`/${label}.svg`} width={24} height={24} alt="" />
    </a>
  );
}
