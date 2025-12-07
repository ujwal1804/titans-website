"use client";

import Navbar from "../components/Navbar";
import AboutBot from "../components/AboutBot";
import Mission from "../components/Mission";
import PageHero from "../components/PageHero";
import StatsSection from "../components/StatsSection";
import WhyChooseUs from "../components/WhyChooseUs";
import TechnologyStack from "../components/TechnologyStack";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Titans Trading",
            "description": "Pioneering the future of algorithmic trading with precision, transparency, and performance.",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://ttitans.com"}/about`,
          })
        }}
      />
      <main className="bg-black text-white min-h-screen pb-20 md:pb-0">
        <Navbar />
        <PageHero 
          title="About Titans" 
          subtitle="Pioneering the future of algorithmic trading with precision, transparency, and performance."
        />
      <StatsSection />
      <AboutBot />
      <Mission />
      <WhyChooseUs />
      <TechnologyStack />
      <Footer />
      <MobileBottomNav />
      </main>
    </>
  );
}
