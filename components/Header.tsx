import Theme from "../components/Theme";
import { Alegreya_SC } from "next/font/google";

const alegreya = Alegreya_SC({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Header() {
  return (
    <header className="flex justify-between items-center">
      <a href="/" className={`text-2xl ml-4 ${alegreya.className}`}>
        MultipediA
      </a>
      <Theme />
      {/* <input type="search" name="search" id="search" /> */}
    </header>
  );
}
