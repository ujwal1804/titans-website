import React from "react";
import { CheckCircle, Clock, Star, TrendingUp, Globe } from "lucide-react";
import { BentoGrid } from "@/components/ui/bento-grid";

function Features() {
  const itemsSample = [
    {
      title: "Autonomous Trading",
      meta: "24/5 Live",
      description:
        "Executes trades automatically with advanced algorithms and risk management strategies.",
      icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />,
      status: "Live",
      tags: ["Automation", "Algorithms", "Trading"],
      colSpan: 2,
      hasPersistentHover: true,
    },
    {
      title: "Risk Management",
      meta: "Smart Allocation",
      description:
        "Dynamic position sizing, stop-loss, and take-profit ensure capital protection in volatile markets.",
      icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />,
      status: "Updated",
      tags: ["Safety", "Strategy", "Capital"],
    },
    {
      title: "Performance Tracking",
      meta: "Real-time Stats",
      description:
        "Monitor your trading performance with live profit tracking and basic performance metrics.",
      icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />,
      status: "Live",
      tags: ["Performance", "Tracking", "Metrics"],
      colSpan: 2,
    },
    {
      title: "Global Coverage",
      meta: "Multi-Region",
      description:
        "Operates seamlessly across multiple exchanges and regions for optimal trading opportunities.",
      icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />,
      status: "Beta",
      tags: ["Global", "Connectivity", "Edge"],
    },
  ];

  return (
    <section id="features" className="py-8 sm:py-12 md:py-16 lg:py-20 text-white">
      <div className="mobile-app-container md:w-[85vw] mx-auto">
        <h2 className="bg-clip-text mb-6 sm:mb-8 md:mb-10 lg:mb-12 flex flex-col text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl z-20 font-bold tracking-tight leading-tight px-4">
          Bot Features
        </h2>

        <BentoGrid items={itemsSample} />
      </div>
    </section>
  );
}

export default Features;
