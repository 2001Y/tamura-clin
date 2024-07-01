import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "診察券アプリ",
  description: "診察券を管理するPWAアプリ",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
