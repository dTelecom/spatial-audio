import "./globals.scss";
import {Footer} from "@/components/Footer/Footer";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="cupcake">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head>
        <title>Web3 Spatial Room | dTelecom Cloud</title>
        <meta
          property="description"
          content="dSpatial is a free, open source spatial meeting web app, built on the basis of the decentralized communication infrastructure of dTelecom Cloud."
        />

        <meta
          property="og:site_name"
          content="Web3 Meeting | dTelecom Cloud"
        />

        <meta
          property="og:image:type"
          content="image/png"
        />

        <meta
          property="og:image"
          content="/og.png"
        />

        <meta
          content="width=device-width, initial-scale=1"
          name="viewport"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={""}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="/favicon.png"
        />
      </head>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
