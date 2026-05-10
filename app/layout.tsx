import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free & Clear English | Sound Like Who You Really Are",
  description: "English communication coaching for Hebrew-speaking professionals. Improve your pronunciation, fluency, and confidence with Sasha Daniel.",
  keywords: "English coaching, pronunciation, fluency, Hebrew speakers, business English, Sasha Daniel",
  openGraph: {
    title: "Free & Clear English | Sasha Daniel",
    description: "Your English is better than you think. It's just not coming out right yet.",
    url: "https://www.freeandclearenglish.com",
    siteName: "Free & Clear English",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full`}>{children}</body>
    </html>
  );
}
