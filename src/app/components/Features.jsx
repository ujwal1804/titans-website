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
      <div className="w-[95vw] md:w-[85vw] mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
              </div>
            </div>
          </div>
          <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl z-20 font-bold tracking-tight leading-tight px-4">
            Bot Features
          </h2>
        </div>

        <BentoGrid items={itemsSample} />
      </div>
    </section>
  );
}

export default Features;
