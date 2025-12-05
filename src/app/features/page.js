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
  );
}
