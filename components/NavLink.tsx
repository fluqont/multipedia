"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  name: string;
  url: string;
}

export default function NavLink({ name, url, children: linkIcon }: Props) {
  const pathname = usePathname();
  return (
    <Link
      key={name}
      title={name}
      href={url}
      className={`group w-[33.3%] flex pt-3 pb-4 gap-1 flex-col items-center ${
        url == pathname && "current"
      }`}
    >
      <div className="group-[.current]:bg-secondary rounded-full px-4 py-1">
        {linkIcon}
      </div>
      <span className="group-[.current]:font-bold">{name}</span>
    </Link>
  );
}
