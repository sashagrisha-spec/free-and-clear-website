import type { Metadata } from "next";
import HomePage from "@/components/home/HomePage";
import { HOME_EN } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Free & Clear English | Speak English with confidence and clarity",
  description: "You know English. Now let's make it sound like you. Pronunciation, fluency and communication coaching with Sasha Daniel.",
  alternates: {
    canonical: "https://www.freeandclearenglish.com",
    languages: { en: "https://www.freeandclearenglish.com", he: "https://www.freeandclearenglish.com/he" },
  },
};

export default function Home() {
  return <HomePage t={HOME_EN} />;
}
