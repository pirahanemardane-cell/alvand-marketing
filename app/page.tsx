import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Cases from "@/components/Cases";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import Team from "@/components/Team";
import Careers from "@/components/Careers";
import Resources from "@/components/Resources";
import Customers from "@/components/Customers";
import FAQ from "@/components/FAQ";
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
