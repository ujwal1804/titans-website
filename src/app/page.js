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

export default function Page() {
  return (
    <main className=" bg-black text-white">
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Hero with animated background */}
      <VenomBeam className="flex items-center justify-center w-full flex-col px-4">
        <Hero />
      </VenomBeam>
      <VenomBeam className="flex items-center justify-center w-full flex-col px-4 pb-32">
        <AboutBot />
      </VenomBeam>
      <VenomBeam className="flex items-center justify-center w-full flex-col px-4">
        <BacktestResults />
      </VenomBeam>
      {/* Other sections */}

      <LiveResults />
      <Features />
      <LeadForm />

      {/* Footer */}
      <Footer />
    </main>
  );
}
