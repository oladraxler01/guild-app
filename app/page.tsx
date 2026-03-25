import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/hero";
import { TrustBar } from "@/components/TrustBar";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedPros } from "@/components/FeaturedPros";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="pt-24 flex-1">
        <Hero />
        <TrustBar />
        <HowItWorks />
        <FeaturedPros />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
