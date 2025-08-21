import React from "react";
import { motion } from "framer-motion";
import { CloudLightning, Cpu, TrendingUp } from "react-feather";
import { SpotlightCard } from "@/components/ui/spotlightcard";
import { InteractiveInput } from "@/components/ui/interactive-input";

export default function AboutBot() {
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
    <section id="about" className=" mt-32 px-6 relative ">
      {/* Section Heading */}
      <h2 className="bg-clip-text mb-12 flex flex-col text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white text-3xl md:text-4xl lg:text-6xl  pb-1 md:pb-2 pt-2 md:pt-4 relative z-20 font-bold tracking-tight leading-tight">
        About the Bot
      </h2>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <SpotlightCard key={idx} className="w-80 h-72" spotlightColor="34, 211, 238">
            <div className="w-full h-full flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-semibold mb-2 text-neutral-500">{feature.icon}</h3>
              <h3 className="text-xl font-semibold mb-1 bg-clip-text flex flex-col text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white   pb-1 md:pb-2 pt-2 md:pt-4 relative z-20 font-bold tracking-tight leading-tight">
                {feature.title}
              </h3>
              <p className="text-sm  bg-clip-text flex flex-col text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white pb-1 md:pb-2 pt-2 md:pt-4 relative z-20 font-bold tracking-tight leading-tight">
                {feature.description}
              </p>
            </div>
          </SpotlightCard>
        ))}
      </div>
        {/* Optional Call-to-Action */}
        <InteractiveInput
          className="cursor-pointer flex mx-auto mt-10 font-bold text-lg w-fit"
          variant="default"
          inputSize="lg"
          glow={true}
          rounded="full"
          hideAnimations={false}
          uppercase={true}
          shimmerSize="0.1rem"
          shimmerDuration="2s"
          placeholder="Request Early Access"
        />
    </section>
  );
}
