import type { Metadata } from "next";
import type { Viewport } from 'next'
import "./globals.scss";
import Footer from './components/footer';
import { IframeWrapper } from './components/iframe';

export const metadata: Metadata = {
  title: "診察券アプリ",
  description: "診察券を管理するPWAアプリ",
  manifest: "/manifest.json",
  themeColor: "#007bff",
};

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <IframeWrapper>
          {children}
          <Footer />
        </IframeWrapper>
      </body>
    </html>
  );
}