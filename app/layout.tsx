import type { Metadata } from "next";
import "./globals.css";
import Header from "./ui/Header";
import Nav from "./ui/Nav";

export const metadata: Metadata = {
  title: "Multipedia",
  description: "Each voice is heard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background m-4 h-[90svh]">
        <Header />
        {children}
        <Nav />
      </body>
    </html>
  );
}
