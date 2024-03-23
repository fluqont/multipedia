import type { Metadata } from "next";
import { Alegreya_SC } from "next/font/google";
import "./globals.css";

const alegreya = Alegreya_SC({
  subsets: ["latin"],
  weight: ["400"],
});

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
      <body className={`bg-background m-4 ${alegreya.className}`}>
        {children}
      </body>
    </html>
  );
}
