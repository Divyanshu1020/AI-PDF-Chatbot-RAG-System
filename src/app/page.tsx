import { HeroSection } from "@/components/global/landing/hero-section";

import { Footer } from "@/components/global/footer/footer";
import { FeaturesSection } from "@/components/global/landing/features-section";

export default function Home() {
  return (
    <main className="min-h-screen relative ">
      {/* <Navbar /> */}
      <HeroSection />
      <FeaturesSection />
      <Footer />
      
    </main>
  );
}