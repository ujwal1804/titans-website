import React from "react";
import { motion } from "framer-motion";
import { CloudLightning, Cpu, TrendingUp } from "react-feather";
import { SpotlightCard } from "@/components/ui/spotlightcard";

export default function AboutBot({ onRequestAccess }) {
  const features = [
    {
      icon: <Cpu size={32} />,
      title: "AI Precision",
      description:
        "Executes trades with surgical accuracy using advanced MQL5 algorithms that adapt to market conditions in real-time.",
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Proven Performance",
      description:
        "Backtested results double equity in 4 months, and even in worst-case scenarios growth is achieved within 7–8 months.",
    },
    {
      icon: <CloudLightning size={32} />,
      title: "Fast & Reliable",
      description:
        "Designed for speed and consistency, handling multiple trades efficiently across volatile markets.",
    },
  ];

  return (
    <section
      id="about"
      className="pt-20  z-50   flex flex-col  justify-center  items-center "
    >
      {/* Section Heading */}
      <h2 className="bg-clip-text mb-8 sm:mb-10 lg:mb-12 flex flex-col text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl z-20 font-bold tracking-tight leading-tight px-4">
        About the Bot
      </h2>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-[95vw] md:w-[85vw] mx-auto">
        {features.map((feature, idx) => (
          <SpotlightCard key={idx} className="" spotlightColor="34, 211, 238">
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-neutral-200">
                {feature.icon}
              </h3>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 bg-clip-text flex flex-col text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white pb-1 sm:pb-2 pt-2 sm:pt-4 relative z-20 font-bold tracking-tight leading-tight">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base bg-clip-text flex flex-col text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white pb-1 sm:pb-2 pt-2 sm:pt-4 relative z-20 font-bold tracking-tight leading-tight leading-relaxed">
                {feature.description}
              </p>
            </div>
          </SpotlightCard>
        ))}
      </div>

      <div className="mt-8 sm:mt-10 lg:mt-12 px-4 z-50">
        <button
          onClick={onRequestAccess}
          className="cursor-pointer font-bold text-base sm:text-lg lg:text-xl px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/50 text-white rounded-full hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 active:scale-[0.98] relative overflow-hidden hover:from-cyan-500/30 hover:to-purple-500/30 hover:border-cyan-400/70 uppercase"
        >
          <span className="relative z-10">Request Early Access</span>
        </button>
      </div>
    </section>
  );
}
