import React from "react";
import { motion } from "framer-motion";

function LeadForm() {

  return (
    <>
      <section className="mt-20">
        <div className="w-[95vw] md:w-[85vw] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4 sm:mb-6">
              Get Early Access
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-3xl mx-auto leading-relaxed">
              Be among the first to experience our revolutionary algorithm-based
              trading bot. Join the waitlist and get exclusive early access.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center items-center"
          >
            <a
              href="https://user-ind.dooprimeglobal.com/signup/gegy-iwzkacjdu-A01"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer font-bold text-base sm:text-lg px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/50 text-white rounded-full hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 active:scale-[0.98] relative overflow-hidden hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/70 inline-block"
            >
              <span className="relative z-10">Get Early Access</span>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs sm:text-sm text-neutral-400 text-center mt-6 sm:mt-8 max-w-md mx-auto"
          >
            We respect your privacy. No spam, ever.
          </motion.p>
        </div>
      </section>

    </>
  );
}

export default LeadForm;
