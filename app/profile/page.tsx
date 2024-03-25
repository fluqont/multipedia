export default function Profile() {
  return (
    <main className="flex flex-col justify-center items-center text-center h-full gap-4">
      <h1 className="text-base font-medium">
        You’re not logged in to an account. Please, log in to an existing account or
        register a new one.
      </h1>
      <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-center">
        <button className="primary w-full px-12 md:!w-fit">Log in</button>
        <button className="secondary w-full px-12 md:!w-fit">Register</button>
      </div>
    </main>
  );
}
