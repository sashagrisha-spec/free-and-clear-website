import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { getLangForPath } from "@/lib/page-lang";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free & Clear English | לדבר אנגלית בביטחון ובהירות",
  description: "Find your voice in English, speak with confidence, and break through the barriers that keep your English stuck. לא רק לדעת אנגלית - אלא גם לדבר אותה בביטחון.",
  keywords: "English pronunciation coach Israel, English fluency coach, אנגלית לדוברי עברית, קואצ'ר אנגלית, שיפור הגייה באנגלית, English coach Hebrew speakers, business English Israel, Sasha Daniel",
  authors: [{ name: "Sasha Daniel" }],
  openGraph: {
    title: "Free & Clear English | Sasha Daniel",
    description: "You know English. Now let's make it sound like you.",
    url: "https://www.freeandclearenglish.com",
    siteName: "Free & Clear English",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.freeandclearenglish.com/images/sasha-1.jpg",
        width: 1200,
        height: 630,
        alt: "Sasha Daniel - Free & Clear English",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free & Clear English | Sasha Daniel",
    description: "You know English. Now let's make it sound like you.",
    images: ["https://www.freeandclearenglish.com/images/sasha-1.jpg"],
  },
  alternates: {
    canonical: "https://www.freeandclearenglish.com",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sasha Daniel",
  jobTitle: "English Communication & Pronunciation Coach",
  description: "English pronunciation and fluency coach for Hebrew-speaking professionals in Israel. Specializes in accent reduction, speaking confidence and business English.",
  url: "https://www.freeandclearenglish.com",
  image: "https://www.freeandclearenglish.com/images/sasha-1.jpg",
  sameAs: [
    "https://www.instagram.com/freeandclearenglish",
    "https://www.linkedin.com/in/sasha-daniel/",
  ],
  knowsAbout: ["English pronunciation", "Accent coaching", "Business English", "Communication coaching", "English fluency"],
  offers: [
    {
      "@type": "Offer",
      name: "1:1 Personal Coaching",
      description: "10-session personal coaching program for English pronunciation and fluency",
    },
    {
      "@type": "Offer",
      name: "English Gym",
      description: "Monthly shadowing club with weekly audio recordings",
      price: "20",
      priceCurrency: "ILS",
    },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname");
  const lang = getLangForPath(pathname);
  const dir = lang === "he" ? "rtl" : "ltr";

  return (
    <html lang={lang} dir={dir} className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className} min-h-full`}>{children}</body>
    </html>
  );
}
