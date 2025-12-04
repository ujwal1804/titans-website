"use client";

import Navbar from "../components/Navbar";
import AboutBot from "../components/AboutBot";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="pt-20 sm:pt-24">
        <AboutBot />
      </div>
      <Footer />
    </main>
  );
}

