import type { Metadata } from "next";
import type { Viewport } from 'next'
import "./globals.scss";
import Footer from './components/footer';
import { IframeWrapper } from './components/iframe';
import Head from 'next/head';

export const metadata: Metadata = {
  title: "診察券アプリ",
  description: "診察券を管理するPWAアプリ",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  viewportFit: 'cover',
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <Head>
        <link rel="preload" href="/apple-touch-icon.jpg" as="image" />
      </Head>
      <body>
        <IframeWrapper>
          {children}
          <Footer />
        </IframeWrapper>
      </body>
    </html>
  );
}