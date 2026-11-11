import type { Metadata } from "next";
import HomePage from "@/components/home/HomePage";
import { HOME_HE } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Free & Clear English | לדבר אנגלית בביטחון ובבהירות",
  description: "אתם יודעים אנגלית. עכשיו בואו נגרום לה להישמע כמוכם. אימון הגייה, שטף ותקשורת באנגלית עם סשה דניאל.",
  alternates: {
    canonical: "https://www.freeandclearenglish.com/he",
    languages: { en: "https://www.freeandclearenglish.com", he: "https://www.freeandclearenglish.com/he" },
  },
};

export default function HomeHe() {
  return <HomePage t={HOME_HE} />;
}
