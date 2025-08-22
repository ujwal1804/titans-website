"use client";

import { useState } from "react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="bg-black text-white min-h-screen">
      <VenomBeam>
        {/* Navbar */}
        <Navbar onRequestAccess={() => setIsModalOpen(true)} />

        {/* Hero with animated background */}
        <Hero />
        <AboutBot onRequestAccess={() => setIsModalOpen(true)} />
        <BacktestResults />
        <LiveResults />
        <Pricing onGetStarted={() => setIsModalOpen(true)} />
        <Features />

        {/* Other sections */}
        <LeadForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

        {/* Footer */}
        <Footer />
      </VenomBeam>
    </main>
  );
}
