import "./globals.scss";
import React from "react";
import DynamicAppWrapper from '@/components/DynamicAppWrapper';
import { Metadata } from 'next';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Web3 Spatial Room | dTelecom Cloud',
  description: 'dSpatial is a free, open source spatial meeting web app, built on the basis of the decentralized communication infrastructure of dTelecom Cloud.',
  openGraph: {
    title: 'Web3 Spatial Room | dTelecom Cloud',
    description: 'dSpatial is a free, open source spatial meeting web app, built on the basis of the decentralized communication infrastructure of dTelecom Cloud.',
    siteName: 'Web3 Meeting | dTelecom Cloud',
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
