"use client";

import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function FeaturesPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="pt-20 sm:pt-24">
        <Features />
      </div>
      <Footer />
    </main>
  );
}

