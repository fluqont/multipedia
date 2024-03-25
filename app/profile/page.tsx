import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await getServerSession(authConfig);

  if (session?.user?.name) {
    return redirect(session.user.name);
  }

  function handleClick() {
    signIn("github");
  }
  return (
    <main className="flex flex-col justify-center items-center text-center h-full gap-4">
      <h1 className="text-base font-medium">
        You’re not logged in to an account. Please, log in to an existing
        account or register a new one.
      </h1>
      <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-center">
        <button
          onClick={handleClick}
          className="primary w-full px-12 md:!w-fit"
        >
          Continue with GitHub
        </button>
      </div>
    </main>
  );
}
