import classes from "./pfp.module.css";

interface PfpProps {
  url?: string;
  pfp?: {
    url: string;
  };
  size?: number;
}

export default function Pfp({ pfp, url, size = 96 }: PfpProps) {
  return (
    <img
      src={
        url
          ? url.replace("//", "/")
          : pfp
          ? (import.meta.env.VITE_STRAPI_HOST + pfp.url).replace("//", "/")
          : "/placeholder.svg"
      }
      alt="user pfp"
      width={size}
      height={size}
      className={classes.pfp}
    />
  );
}
