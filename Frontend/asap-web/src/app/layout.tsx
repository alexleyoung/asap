import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({ src: "../assets/fonts/Satoshi.ttf" });

export const metadata: Metadata = {
  title: "asap",
  description: "eliminate time spent on scheduling, and get things done asap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={satoshi.className}>{children}</body>
    </html>
  );
}
