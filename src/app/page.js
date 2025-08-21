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
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Hero with animated background */}
      <VenomBeam className="flex items-center justify-center w-full flex-col px-4 sm:px-6 lg:px-8">
        <Hero />
      </VenomBeam>
      
      <VenomBeam className="flex items-center justify-center w-full flex-col px-4 sm:px-6 lg:px-8">
        <AboutBot />
      </VenomBeam>
      
      <VenomBeam className="flex items-center justify-center w-full flex-col px-4 sm:px-6 lg:px-8">
        <BacktestResults />
      </VenomBeam>
      
      <VenomBeam className="flex items-center justify-center w-full flex-col px-4 sm:px-6 lg:px-8">
        <LiveResults />
      </VenomBeam>
      
      <VenomBeam className="flex items-center justify-center w-full flex-col px-4 sm:px-6 lg:px-8">
        <Features />
      </VenomBeam>
      
      <VenomBeam className="flex items-center justify-center w-full flex-col px-4 sm:px-6 lg:px-8">
        <Pricing/>
      </VenomBeam>
      
      {/* Other sections */}
      <LeadForm />

      {/* Footer */}
      <Footer />
    </main>
  );
}
