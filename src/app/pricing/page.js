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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Offer",
            "name": "Titans Trading Bot - Lifetime Access",
            "description": "Lifetime access to automated trading bot with profit-sharing model",
            "price": "50",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://titans-trading.com"}/pricing`,
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "50",
              "priceCurrency": "USD",
              "valueAddedTaxIncluded": false
            }
          })
        }}
      />
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
    </>
  );
}
