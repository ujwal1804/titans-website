"use client";

import VenomBeam from "@/components/ui/venom-beam";
import AboutBot from "./components/AboutBot";
import BacktestResults from "./components/BacktestResults";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import LeadForm from "./components/LeadForm";
import LiveResults from "./components/LiveResults";
import Navbar from "./components/Navbar";
import Pricing from "./components/Pricing";

export default function Page() {
  return (
    <main className="bg-black text-white min-h-screen">
      <VenomBeam>
        {/* Navbar */}
        {/* <Navbar /> */}

        {/* Hero with animated background */}
        <Hero />
        <AboutBot />
        <BacktestResults />
        <LiveResults />
        <Features />
        <Pricing />

        {/* Other sections */}
        <LeadForm />

        {/* Footer */}
        <Footer />
      </VenomBeam>
    </main>
  );
}
