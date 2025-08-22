"use client";

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlightcard";

export default function SplineSceneBasic() {
  return (
    <Card className="w-[95vw] md:w-[85vw] h-[80vh]  mx-auto overflow-hidden flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 rounded-xl shadow-2xl">
      {/* Left content */}
      <div className="flex-1 flex flex-col justify-center z-10  py-6 sm:py-8 lg:py-10 order-2 lg:order-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight tracking-tight text-center   xl:text-left hidden md:block">
          Futuristic Trading
        </h1>
        <p className="mt-3 sm:mt-4 md:mt-5 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-neutral-300 max-w-full text-center 2xl:text-left mx-auto leading-relaxed  hidden md:block">
          Experience next-level trading with our algorithm-based bot. Track
          profits, automate strategies, and engage with live 3D insights for
          smarter decisions.
        </p>
      </div>

      {/* Right content */}
      <div className="flex-1 relative order-1 lg:order-2 min-h-[500px]  lg:min-h-[350px] xl:min-h-[400px] w-full">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Spotlight card for extra highlight */}
      <SpotlightCard
        className="hidden lg:block lg:absolute lg:left-1/3 lg:-top-16 xl:-top-20 2xl:-top-24"
        fill="white"
      />
    </Card>
  );
}
