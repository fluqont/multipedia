interface Link {
  name: string;
  href?: string;
  svg: () => React.JSX.Element;
}

import Home from "../icons/Home";
import Bookmark from "../icons/Bookmark";
import Person from "../icons/Person";
import NavLink from "./NavLink";

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
    <nav className="flex md:hidden min-w-full text-xs font-medium bg-surface-variant fixed bottom-0 left-0 z-10 capitalize">
      {LINKS.map((link) => {
        const linkUrl = `/${link.href ?? link.name}`;
        const LinkIcon = link.svg;
        return (
          <NavLink name={link.name} url={linkUrl} key={link.name}>
            <LinkIcon />
          </NavLink>
        );
      })}
    </nav>
  );
}
