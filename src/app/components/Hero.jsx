"use client";

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import HomeStats from "./HomeStats";

export default function SplineSceneBasic() {
  return (
    <section id="home" className="pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12">
      <Card className="mobile-app-container md:w-[85vw] h-[70vh] sm:h-[75vh] md:h-[80vh] mx-auto overflow-hidden flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 rounded-2xl sm:rounded-3xl shadow-2xl mobile-card">
      {/* Left content */}
      <div className="flex-1 flex flex-col justify-center z-10 py-4 sm:py-6 md:py-8 lg:py-10 order-2 lg:order-1 px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight tracking-tight text-center lg:text-left">
          Futuristic Trading
        </h1>
        <p className="mt-3 sm:mt-4 md:mt-5 text-sm sm:text-base md:text-lg lg:text-xl text-neutral-300 max-w-full text-center lg:text-left mx-auto lg:mx-0 leading-relaxed">
          Experience next-level trading with our algorithm-based bot. Track
          profits, automate strategies, and engage with live 3D insights for
          smarter decisions.
        </p>
      </div>

      {/* Right content */}
      <div className="flex-1 relative order-1 lg:order-2 min-h-[300px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[350px] xl:min-h-[400px] w-full">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Spotlight card for extra highlight */}
     
      </Card>
    </section>
  );
}
