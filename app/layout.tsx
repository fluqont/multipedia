import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-background m-4">{children}</body>
    </html>
  );
}
