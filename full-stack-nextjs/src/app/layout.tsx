import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Scaffolding",
  description: "Full-stack application scaffold",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}