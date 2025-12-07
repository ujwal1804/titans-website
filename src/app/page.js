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
import MobileBottomNav from "./components/MobileBottomNav";

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "name": "Titans Trading",
            "description": "AI-Powered Algorithmic Trading Bot for Automated Forex Trading",
            "url": process.env.NEXT_PUBLIC_SITE_URL || "https://ttitans.com",
            "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://ttitans.com"}/logo.png`,
            "sameAs": [
              "https://twitter.com/titanstrading"
            ],
            "offers": {
              "@type": "Offer",
              "price": "50",
              "priceCurrency": "USD",
              "description": "Lifetime access to automated trading bot"
            }
          })
        }}
      />
      <main className="bg-black text-white min-h-screen pb-20 md:pb-0">
        <VenomBeam>
          {/* Navbar */}
          <Navbar />

          {/* Hero with animated background */}
          <Hero />
          <AboutBot />
          <BacktestResults />
          <LiveResults />
          <Pricing />
          <Features />

          {/* Other sections */}
          <LeadForm />

          {/* Footer */}
          <Footer />
          
          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />
        </VenomBeam>
      </main>
    </>
  );
}
