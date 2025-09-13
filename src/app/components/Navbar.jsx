import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/[0.08] backdrop-blur-[20px] border-b border-white/[0.1]"
          : "bg-transparent"
      }`}
    >
      <div className="w-[95vw] md:w-[85vw] mx-auto ">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Titans Trading
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ y: -2 }}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <motion.a
              href="https://user-ind.dooprimeglobal.com/signup/gegy-iwzkacjdu-A01"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/50 text-white rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/70 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-transparent inline-block"
            >
              Get Started
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/[0.05] backdrop-blur-[20px] border-t mt-2 rounded-2xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                {navItems.map((item) => (
                  <motion.button
                    key={item.name}
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      const targetElement = document.querySelector(item.href);
                      
                      if (targetElement) {
                        // Get the element's position
                        const elementTop = targetElement.offsetTop;
                        const navbarHeight = 80; // Approximate navbar height
                        
                        // Scroll to the element with offset for navbar
                        window.scrollTo({
                          top: elementTop - navbarHeight,
                          behavior: 'smooth'
                        });
                      }
                      
                      // Close menu after a delay to allow scrolling to start
                      setTimeout(() => {
                        setIsMobileMenuOpen(false);
                      }, 500);
                    }}
                    className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-200 font-medium focus:outline-none focus:text-white cursor-pointer py-2"
                  >
                    {item.name}
                  </motion.button>
                ))}
                <motion.a
                  href="https://user-ind.dooprimeglobal.com/signup/gegy-iwzkacjdu-A01"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/50 text-white rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/70 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-transparent inline-block text-center"
                >
                  Get Started
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;
