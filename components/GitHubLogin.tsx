"use client";

import { signIn } from "next-auth/react";

export default function GitHubLogin() {
  function handleClick() {
    signIn("github");
  }
  return (
    <button onClick={handleClick} className="primary w-full px-12 md:!w-fit">
      Continue with GitHub
    </button>
  );
}
