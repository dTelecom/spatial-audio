import "@dtelecom/components-styles";
import "./globals.scss";
import React from "react";
import DynamicAppWrapper from '@/components/DynamicAppWrapper';
import { Metadata } from 'next';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const title = "dMeet | Spatial Meeting App"
const description = "Free, open-source, 2D world where you can interact, see, and hear others with spatial stereo audio. Use the app, Invite friends, Earn points. Powered by dTelecom."

export const metadata: Metadata = {
  metadataBase: new URL("https://spatial.dmeet.org"),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description,
    siteName: title,
    images: [ "/og.png" ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="cupcake"
    >
    <body className={inter.className}>
    <DynamicAppWrapper>
      {children}
    </DynamicAppWrapper>
    </body>
    </html>
  );
}
