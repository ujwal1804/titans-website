import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

function Navbar({ onRequestAccess }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/[0.08] backdrop-blur-[20px] border-b border-white/[0.1]' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRequestAccess}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/50 text-white rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:from-cyan-500/30 hover:to-purple-500/30 hover:border-cyan-400/70 font-medium"
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors duration-200"
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
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/[0.05] backdrop-blur-[20px] border-t border-white/[0.1] mt-2 rounded-2xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                {navItems.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    whileHover={{ x: 4 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </motion.a>
                ))}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onRequestAccess();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/50 text-white rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:from-cyan-500/30 hover:to-purple-500/30 hover:border-cyan-400/70 font-medium"
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;