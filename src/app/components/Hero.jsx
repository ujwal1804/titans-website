'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlightcard";

export default function SplineSceneBasic() {
  return (
    <Card className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] mx-auto overflow-hidden flex flex-col lg:flex-row gap-4 lg:gap-0">
      
      {/* Left content */}
      <div className="flex-1 flex flex-col justify-center z-10 px-4 sm:px-6 lg:px-8 py-6 lg:py-0 order-2 lg:order-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
          Futuristic Trading
        </h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-neutral-300 max-w-lg leading-relaxed">
          Experience next-level trading with our AI-powered bot. Track profits, automate strategies, and engage with live 3D insights for smarter decisions.
        </p>
      </div>

      {/* Right content */}
      <div className="flex-1 relative order-1 lg:order-2 min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Optional spotlight card for extra highlight - hidden on mobile */}
      <SpotlightCard
        className="hidden lg:block lg:absolute lg:left-60 lg:-top-20"
        fill="white"
      />
    </Card>
  )
}
