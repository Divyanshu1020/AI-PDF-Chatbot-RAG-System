import { Navbar } from "@/components/global/navbar/navbar";
import { HeroSection } from "@/components/global/landing/hero-section";

import { TechStackSection } from "@/components/global/landing/tech-stack-section";
import { CTASection } from "@/components/global/landing/cta-section";
import { Footer } from "@/components/global/footer/footer";
import { FeaturesSection } from "@/components/global/landing/features-section";
import HowItWorksSection from "@/components/global/landing/how-it-works-section";

export default function Home() {
  return (
    <main className="min-h-screen relative ">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TechStackSection />
      <CTASection />
      <Footer />
      
    </main>
  );
}