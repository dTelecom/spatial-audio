"use client";

import React from "react";
import dynamic from "next/dynamic";

const HomePage = dynamic(() => import('@/components/pages/HomePage'), { ssr: false });

export default function Home() {
  return <HomePage />;
}
