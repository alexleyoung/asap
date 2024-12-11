import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/contexts/UserContext";

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
      <body className={satoshi.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <UserProvider>{children}</UserProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
