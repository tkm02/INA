import type { Metadata } from "next";
import { Lexend_Deca, Poppins } from 'next/font/google';

import "./globals.css";


export const metadata: Metadata = {
  title: "INA - I'm Not Alone",
  description: "Application de soutien en santé mentale",
  manifest: "/manifest.json",
  themeColor: "#00569E",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-lexend',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${lexendDeca.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00569E" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}


