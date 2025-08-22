import React from "react";

function Pricing() {
  return (
    <section className=" text-gray-100 py-20 relative overflow-hidden">
      {/* Background gradient for depth */}

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div className="w-[95vw] md:w-[75vw] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        {/* Left Section */}
        <div className="flex-1 max-w-xl space-y-6 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Bot Pricing
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
            Profit-sharing made simple. Start with a minimum investment and
            withdraw profits anytime. Our bot handles everything with
            transparency and efficiency.
          </p>
        </div>

        {/* Right Section - Premium Glassmorphism Card */}
        <div className="flex-1 flex justify-end ">
          <div className="w-full max-w-md relative group">
            {/* Main glass card */}
            <div className="bg-white/[0.08] backdrop-blur-[40px] rounded-3xl p-8 shadow-2xl border border-white/[0.12] transition-all duration-500 hover:bg-white/[0.12] hover:border-white/[0.18] hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.15)]">
              {/* Inner glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.15] via-transparent to-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content container */}
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-6">
                  Profit Sharing Model
                </h3>

                <ul className="space-y-4 text-gray-200">
                  <li className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.12]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="font-medium">Minimum Investment: $500</span>
                  </li>
                  <li className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.12]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="font-medium">Withdraw Profits Anytime</span>
                  </li>
                  <li className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.12]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="font-medium">No Hidden Fees</span>
                  </li>
                  <li className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.12]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="font-medium">Transparent Performance</span>
                  </li>
                </ul>

                <button className="mt-8 w-full px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-black/20 backdrop-blur-sm border border-cyan-400/50 text-white rounded-2xl font-semibold tracking-wide shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 active:scale-[0.98] group/btn relative overflow-hidden hover:from-cyan-500/30 hover:to-purple-500/30 hover:border-cyan-400/70">
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-cyan-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started
                    <svg
                      className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Floating accent elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
