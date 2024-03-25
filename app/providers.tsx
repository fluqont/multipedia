"use client";

import { ThemeProvider } from "next-themes";
import { type PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
