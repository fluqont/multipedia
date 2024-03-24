interface Link {
  name: string;
  href?: string;
  svg: () => React.JSX.Element;
}

import Link from "next/link";

import Home from "../icons/Home";
import Bookmark from "../icons/Bookmark";
import Person from "../icons/Person";

const LINKS: Link[] = [
  {
    name: "home",
    href: "",
    svg: Home,
  },
  {
    name: "saved",
    svg: Bookmark,
  },
  {
    name: "profile",
    svg: Person,
  },
];

export default function Nav() {
  return (
    <nav className="flex md:hidden min-w-full text-xs font-medium bg-surface fixed bottom-0 left-0 z-10 capitalize">
      {LINKS.map((link) => {
        const LinkIcon = link.svg;
        return (
          <Link
            key={link.name}
            title={link.name}
            href={`/${link.href ?? link.name}`}
            className={
              "group w-[33%] flex pt-3 pb-4 gap-1 flex-col items-center"
            }
          >
            <div className="group-[.current]:bg-secondary rounded-full px-4 py-1">
              <LinkIcon />
            </div>
            <span className="group-[.current]:font-bold">{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
