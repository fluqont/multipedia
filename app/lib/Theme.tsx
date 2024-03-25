"use client";

import Dark from "../icons/Dark";
import { useTheme } from "next-themes";
import Light from "../icons/Light";
import { useEffect, useState } from "react";

export default function Theme() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="theme">
        Toggle theme. Current theme: {theme}
      </label>
      <input
        type="checkbox"
        name="theme"
        id="theme"
        className="absolute w-full h-full opacity-0"
        onClick={() => setTheme(theme == "dark" ? "light" : "dark")}
      />
      {theme == "dark" ? <Dark /> : <Light />}
    </div>
  );
}
