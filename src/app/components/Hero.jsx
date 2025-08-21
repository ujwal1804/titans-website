'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlightcard";

export default function SplineSceneBasic() {
  return (
    <Card className="max-w-7xl h-[500px] overflow-hidden flex flex-col md:flex-row">
      
      {/* Left content */}
      <div className="flex-1 p-8 flex flex-col justify-center z-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Futuristic Trading
        </h1>
        <p className="mt-4 text-neutral-300 max-w-lg">
          Experience next-level trading with our AI-powered bot. Track profits, automate strategies, and engage with live 3D insights for smarter decisions.
        </p>
      </div>

      {/* Right content */}
      <div className="flex-1 relative">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Optional spotlight card for extra highlight */}
      <SpotlightCard
        className="hidden md:block md:absolute md:left-60 md:-top-20"
        fill="white"
      />
    </Card>
  )
}
