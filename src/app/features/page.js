"use client";

import Navbar from "../components/Navbar";
import Features from "../components/Features";
import PageHero from "../components/PageHero";
import TechnologyStack from "../components/TechnologyStack";
import WhyChooseUs from "../components/WhyChooseUs";
import StatsSection from "../components/StatsSection";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";

export default function FeaturesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Titans Trading Bot",
            "applicationCategory": "FinanceApplication",
            "description": "AI-Powered Algorithmic Trading Bot with autonomous trading, risk management, and performance tracking features",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://titans-trading.com"}/features`,
            "featureList": [
              "Autonomous Trading",
              "Risk Management",
              "Performance Tracking",
              "Global Coverage"
            ]
          })
        }}
      />
      <main className="bg-black text-white min-h-screen pb-20 md:pb-0">
        <Navbar />
        <PageHero 
          title="Powerful Features" 
          subtitle="Built with advanced technology to give you the edge in any market condition."
        />
      <StatsSection />
      <Features />
      <TechnologyStack />
      <WhyChooseUs />
      <Footer />
      <MobileBottomNav />
      </main>
    </>
  );
}
