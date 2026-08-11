import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/UI/Header";
import Footer from "@/UI/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Todo App",
    default: "Todo App",
  },
  description: "A focused place for your tasks",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-svh flex-col">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
