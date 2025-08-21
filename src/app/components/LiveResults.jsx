import React from "react";
import { motion } from "framer-motion";
import { PixelCanvas } from "@/components/ui/pixel-canvas";

function LiveResults() {
  const results = [
    { label: "Profit Achieved", value: "+18.7%" },
    { label: "Growth in Equity", value: "1.18x" },
    { label: "Duration", value: "August 2025" },
  ];

  return (
    <section
      id="live-results"
      className="relative py-24 px-6  text-white text-center"
    >
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-5xl font-bold mb-4"
      >
        Live Trading Results
      </motion.h2>
      <p className="text-neutral-400 text-lg mb-12">
        Verified performance for{" "}
        <span className="text-white font-semibold">August 2025</span>
      </p>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {results.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="w-[280px] mx-auto"
          >
            <button
              className="group relative w-full overflow-hidden border border-border rounded-[32px] aspect-square transition-colors duration-200 hover:border-[#0ea5e9] focus:outline-[5px] focus:outline-[Highlight]"
              style={{ "--active-color": "text-neutral-500" }}
            >
              <PixelCanvas
                gap={10}
                speed={25}
                colors={["#e0f2fe", "#7dd3fc", "#0ea5e9"]}
                variant="icon"
              />
              <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-4">
                <span className="text-4xl font-bold text-cyan-500 group-hover:text-[var(--active-color)] transition-colors">
                  {item.value}
                </span>
                <span className="text-neutral-400 text-sm mt-2">
                  {item.label}
                </span>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default LiveResults;
