import Nav from "@/components/Nav";
import LaunchBanner from "@/components/LaunchBanner";
import Hero from "@/components/Hero";
import Logos from "@/components/Logos";
import About from "@/components/About";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import WhatsAppTestimonials from "@/components/WhatsAppTestimonials";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <LaunchBanner />
      <Hero />
      <Logos />
      <About />
      <Services />
      <Testimonials />
      <WhatsAppTestimonials />
      <ContactCTA />
      <Footer />
    </main>
  );
}
