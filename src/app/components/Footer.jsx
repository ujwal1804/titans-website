import React from "react";
import { motion } from "framer-motion";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 relative overflow-hidden">
      {/* Background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent" />

      {/* Futuristic background elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/6 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/6 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-56 h-56 bg-cyan-500/4 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 w-[95vw] md:w-[85vw] mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
          className="bg-white/[0.06] backdrop-blur-[40px] rounded-xl border border-white/[0.12] p-4 shadow-2xl relative overflow-hidden group"
        >
          {/* Futuristic inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.08] via-transparent to-blue-500/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />

          {/* Sleek pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(255,255,255,0.02)_50%)] bg-[length:4px_4px] opacity-30" />

          {/* Desktop Layout */}
          <div className="relative z-10 hidden md:flex items-center justify-between">
            {/* Company branding */}
            <div className="flex items-center space-x-3">
              <motion.h3
                className="text-lg font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent tracking-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                TITANS TRADING
              </motion.h3>
              <div className="w-px h-4 bg-gradient-to-b from-transparent via-gray-400 to-transparent" />
            </div>

            {/* Copyright */}
            <motion.p
              className="text-xs text-gray-300 font-medium tracking-wider uppercase"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              © {currentYear} All Rights Reserved
            </motion.p>

            {/* Futuristic accent */}
            <div className="flex items-center space-x-2 text-xs text-gray-400 tracking-wider">
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
              <span className="uppercase font-medium">
                Powered by Advanced Algorithms
              </span>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-500" />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="relative z-10 md:hidden flex flex-col items-center space-y-3">
            {/* Company branding */}
            <motion.h3
              className="text-base font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent tracking-tight text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              TITANS TRADING
            </motion.h3>

            {/* Copyright */}
            <motion.p
              className="text-xs text-gray-300 font-medium tracking-wider uppercase text-center"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              © {currentYear} All Rights Reserved
            </motion.p>

            {/* Futuristic accent */}
            <div className="flex items-center space-x-2 text-xs text-gray-400 tracking-wider">
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
              <span className="uppercase font-medium text-center">
                Powered by Algorithms
              </span>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-500" />
            </div>
          </div>

          {/* Futuristic corner accents */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400/40 rounded-full blur-sm animate-pulse" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-blue-400/40 rounded-full blur-sm animate-pulse delay-1000" />
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
