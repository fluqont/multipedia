import Theme from "../lib/Theme";

export default function Header() {
  return (
    <header>
      <nav className="flex justify-between items-center">
        <a href="/" className="text-2xl ml-4">
          MultipediA
        </a>
        {/* <Theme /> */}
        {/* <input type="search" name="search" id="search" /> */}
      </nav>
    </header>
  );
}
