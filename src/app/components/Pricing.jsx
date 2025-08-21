
import React from "react";

function Pricing() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="mb-8 sm:mb-10 lg:mb-12 space-y-3 sm:space-y-4">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
            Bot Pricing
          </h2>
          <p className="text-center text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
            Profit-sharing made simple. Start with a minimum investment and
            withdraw profits anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
