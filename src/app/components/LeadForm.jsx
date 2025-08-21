import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveInput } from "@/components/ui/interactive-input";

function LeadForm() {
  return (
    <section className="mt-16 sm:mt-20 lg:mt-24 px-4 sm:px-6 lg:px-8">
      <div className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4 sm:mb-6">
            Get Early Access
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Be among the first to experience our revolutionary AI trading bot. Join the waitlist and get exclusive early access.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
        >
          <InteractiveInput
            className="cursor-pointer font-bold text-base sm:text-lg w-full sm:w-auto"
            variant="default"
            inputSize="lg"
            glow={true}
            rounded="full"
            hideAnimations={false}
            uppercase={true}
            shimmerSize="0.1rem"
            shimmerDuration="2s"
            placeholder="Enter your email"
          />
          <InteractiveInput
            className="cursor-pointer font-bold text-base sm:text-lg w-full sm:w-auto"
            variant="default"
            inputSize="lg"
            glow={true}
            rounded="full"
            hideAnimations={false}
            uppercase={true}
            shimmerSize="0.1rem"
            shimmerDuration="2s"
            placeholder="Request Access"
          />
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
  );
}

export default LeadForm;