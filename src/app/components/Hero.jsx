"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import HomeStats from "./HomeStats";

export default function SplineSceneBasic() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const whatsappNumbers = [
    { number: "+971505094182", label: "+971 50 509 4182" },
    { number: "+971509756963", label: "+971 50 975 6963" },
  ];
  const whatsappMessage = "Hello! I'm interested in your trading services.";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleWhatsAppClick = (number) => {
    const url = `https://wa.me/${number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <section id="home" className="pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 relative">
      <Card className="w-[95vw] md:w-[85vw] h-[75vh] sm:h-[75vh] md:h-[80vh] mx-auto px-2 sm:px-4 md:px-6 overflow-visible sm:overflow-hidden flex flex-col lg:flex-row gap-2 sm:gap-4 md:gap-6 lg:gap-8 rounded-2xl sm:rounded-3xl shadow-2xl mobile-card">
      {/* Left content */}
      <div className="hidden lg:flex flex-1 flex-col justify-center z-10 py-4 sm:py-6 md:py-8 lg:py-10 order-2 lg:order-1 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight tracking-tight text-center lg:text-left">
          Futuristic Trading
        </h1>
        <p className="mt-3 sm:mt-4 md:mt-5 text-sm sm:text-base md:text-lg lg:text-xl text-neutral-300 max-w-full text-center lg:text-left mx-auto lg:mx-0 leading-relaxed">
          Experience next-level trading with our algorithm-based bot. Track
          profits, automate strategies, and engage with live 3D insights for
          smarter decisions.
        </p>
      </div>

      {/* Right content - Robot Scene */}
      <div className="flex-1 relative order-1 lg:order-2 h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-full w-full overflow-visible sm:overflow-hidden">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center p-2 sm:p-0">
          <div className="w-full h-full max-w-full max-h-full flex items-center justify-center">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Spotlight card for extra highlight */}
     
      </Card>

      {/* Contact Us Button - Rectangular Box */}
      <div ref={dropdownRef} className="fixed bottom-0 right-0 z-50 flex flex-col items-end">
        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-2 mr-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden min-w-[220px]"
            >
              <div className="px-4 py-2 border-b border-white/10 bg-white/5">
                <p className="text-xs text-white/70 font-medium">Contact via WhatsApp</p>
              </div>
              {whatsappNumbers.map((contact, index) => (
                <button
                  key={index}
                  onClick={() => handleWhatsAppClick(contact.number)}
                  className="group w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-150 flex items-center gap-3 border-b border-white/5 last:border-b-0"
                >
                  <svg
                    className="w-5 h-5 text-white/80 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.372a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span className="font-medium text-white text-sm">{contact.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Us Button - Rectangular with Skew */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative bg-white/10 backdrop-blur-xl  px-6 py-3 hover:bg-white/15 hover:border-white/30 transition-all duration-300 flex items-center justify-center"
          aria-label="Contact Us"
        >
          <span className="text-white font-semibold text-sm sm:text-base" style={{ transform: "skewX(8deg)" }}>
            Contact Us
          </span>
        </button>
      </div>
    </section>
  );
}
