import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Cases from "@/components/Cases";
const Pricing = dynamic(() => import("@/components/Pricing"), { ssr: true });
const About = dynamic(() => import("@/components/About"), { ssr: true });
const Team = dynamic(() => import("@/components/Team"), { ssr: true });
const Careers = dynamic(() => import("@/components/Careers"), { ssr: true });
const Resources = dynamic(() => import("@/components/Resources"), { ssr: true });
const Customers = dynamic(() => import("@/components/Customers"), { ssr: true });
const FAQ = dynamic(() => import("@/components/FAQ"), { ssr: true });
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <main className="w-full">
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <Cases />
      <Pricing />
      <About />
      <Team />
      <Careers />
      <Resources />
      <Customers />
      <FAQ />
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  );
}
