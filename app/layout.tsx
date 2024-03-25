import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Nav from "../components/Nav";
import Providers from "./providers";

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
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className="bg-background m-4 h-[90svh]">
        <Providers>
          <Header />
          {children}
          <Nav />
        </Providers>
      </body>
    </html>
  );
}
