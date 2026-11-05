import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
const Process = dynamic(() => import("@/components/Process"), { ssr: true });
const Cases = dynamic(() => import("@/components/Cases"), { ssr: true });
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
import { metadataForPageKey } from "@/lib/seo/pages";

/** Keep home Resources/blog slice fresh after CMS edits (smoke cleanup, new posts). */
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return metadataForPageKey("home", { path: "/" });
}

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
