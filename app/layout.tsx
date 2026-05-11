import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JTTS Dashboard Geospasial",
  description: "Monitoring Pembangunan Jalan Tol Trans Sumatera",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
        
        <link href='https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css' rel='stylesheet' />
        <script src='https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js'></script>
        <script src="https://unpkg.com/@maplibre/maplibre-gl-leaflet@0.0.19/leaflet-maplibre-gl.js"></script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
