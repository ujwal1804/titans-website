"use client";

import Navbar from "../components/Navbar";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";
import PageHero from "../components/PageHero";
import StatsSection from "../components/StatsSection";
import WhyChooseUs from "../components/WhyChooseUs";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";

export default function PricingPage() {
  return (
    <main className="bg-black text-white min-h-screen pb-20 md:pb-0">
      <Navbar />
      <PageHero 
        title="Transparent Pricing" 
        subtitle="No hidden fees. No subscriptions. We only make money when you make money."
      />
      <StatsSection />
      <Pricing />
      <WhyChooseUs />
      <FAQ />
      <Footer />
      <MobileBottomNav />
    </main>
  );
}
