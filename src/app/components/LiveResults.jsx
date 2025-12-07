"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { PixelCanvas } from "@/components/ui/pixel-canvas";
import { useMyFxBook } from "@/hooks/useMyFxBook";

function LiveResults() {
  const { getAccounts, isAuthenticated, login } = useMyFxBook();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        // Auto-login if not authenticated
        await login();
      }
    };
    loadData();
  }, [isAuthenticated, login]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAccountData();
    }
  }, [isAuthenticated]);

  const loadAccountData = async () => {
    setLoading(true);
    try {
      const result = await getAccounts();
      if (result.success && result.account) {
        setAccount(result.account);
      }
    } catch (error) {
      console.error("Error loading account data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format percentage
  const formatPercent = (value) => {
    return `${parseFloat(value).toFixed(2)}%`;
  };

  // Calculate results from account data
  const results = useMemo(() => {
    return account
      ? [
          {
            label: "Total Profit",
            value: `${account.currency} ${formatCurrency(account.profit)}`,
          },
          {
            label: "Total Gain",
            value: `+${formatPercent(account.gain)}`,
          },
          {
            label: "Last Update",
            value: account.lastUpdateDate || "N/A",
          },
        ]
      : [
          { label: "Profit Achieved", value: "+18.7%" },
          { label: "Growth in Equity", value: "1.18x" },
          { label: "Duration", value: "August 2025" },
        ];
  }, [account]);

  // Check scroll position for navigation buttons
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [results, account]);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // w-[320px] + gap-4 = ~336px
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320;
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="live-results"
      className="flex flex-col w-full py-8 sm:py-12 md:py-16 lg:py-20 text-white text-center"
    >
      {/* Title */}
      <div className="w-[95vw] md:w-[85vw] mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-left"
        >
          Live Trading Results
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-neutral-400 text-sm sm:text-base md:text-lg mb-8 sm:mb-12 md:mb-16 lg:mb-20 text-left"
        >
          {account
            ? `Real-time performance for ${account.name || "Titansfx2.0"}`
            : "Verified performance data"}
        </motion.p>
      </div>

      {/* Mobile/Tablet: Horizontal Scrollable Cards */}
      <div className="w-[95vw] md:w-[85vw] mx-auto px-4 sm:px-6">
        {/* Mobile/Tablet Layout - Carousel */}
        <div className="block lg:hidden relative">
          {/* Carousel Container */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 min-w-max">
              {results.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
                >
                  <div className="relative h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 overflow-hidden group cursor-pointer active:scale-95 transition-transform duration-200">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Animated border glow */}
                    <div className="absolute inset-0 rounded-3xl border border-cyan-400/0 group-hover:border-cyan-400/30 transition-all duration-500"></div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Value */}
                      <div className="mb-3">
                        <span className={`text-3xl sm:text-4xl font-bold block ${
                          item.value.includes('+') || item.value.includes(account?.currency) 
                            ? 'text-cyan-400' 
                            : 'text-white'
                        } group-hover:text-cyan-300 transition-colors duration-300`}>
                          {item.value}
                        </span>
                      </div>
                      
                      {/* Label */}
                      <div className="mt-auto pt-4 border-t border-white/10 group-hover:border-cyan-400/30 transition-colors duration-300">
                        <span className="text-neutral-400 text-sm sm:text-base font-medium uppercase tracking-wider group-hover:text-white/80 transition-colors duration-300">
                          {item.label}
                        </span>
                      </div>
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {results.map((_, index) => {
              const isActive = scrollContainerRef.current 
                ? Math.round(scrollContainerRef.current.scrollLeft / 336) === index 
                : index === 0;
              return (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-cyan-400 w-8' : 'bg-white/20 w-2'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Desktop Layout - Original Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 md:gap-8">
          {results.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <div className="mobile-card crm-card p-6 sm:p-8 aspect-square flex flex-col items-center justify-center text-center group interactive-element relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Pixel canvas effect */}
                <div className="absolute inset-0 opacity-30">
                  <PixelCanvas
                    gap={10}
                    speed={25}
                    colors={["#e0f2fe", "#7dd3fc", "#0ea5e9"]}
                    variant="icon"
                  />
                </div>
                
                {/* Content */}
                <div className="relative z-10 w-full">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors break-words block mb-3">
                    {item.value}
                  </span>
                  <span className="text-neutral-400 text-sm sm:text-base uppercase tracking-wider font-medium">
                    {item.label}
                  </span>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="mt-8 text-center">
          <p className="text-neutral-400 text-sm">Loading live data...</p>
        </div>
      )}
    </section>
  );
}

export default LiveResults;
