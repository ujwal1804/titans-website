"use client";

import Navbar from "../components/Navbar";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

export default function PricingPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="pt-20 sm:pt-24">
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}

