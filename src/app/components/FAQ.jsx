"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, HelpCircle, DollarSign, CreditCard, Shield, BookOpen, Users } from "lucide-react";

const faqs = [
  {
    question: "What is the minimum investment required?",
    answer: "You can start trading with Titans Trading with a minimum investment of just $500. This ensures you have enough capital to effectively manage risk and see meaningful returns.",
    icon: DollarSign,
    color: "from-emerald-400 to-emerald-600",
  },
  {
    question: "How does the profit sharing work?",
    answer: "We operate on a 50/50 profit split model. You keep 50% of all profits generated, and we take 50% as our performance fee. There is a monthly subscription fee of $50 to access the trading bot, and we only take our share when you make money.",
    icon: CreditCard,
    color: "from-cyan-400 to-cyan-600",
  },
  {
    question: "What is the monthly subscription fee?",
    answer: "The monthly subscription fee is $50. This covers access to our trading bot, real-time performance tracking, and ongoing support. This fee is separate from the profit-sharing arrangement.",
    icon: CreditCard,
    color: "from-blue-400 to-blue-600",
  },
  {
    question: "Can I withdraw my funds at any time?",
    answer: "Yes, you maintain full control of your funds. You can withdraw your capital and profits at any time through our partner broker's secure portal. Withdrawals are typically processed within 24 hours.",
    icon: DollarSign,
    color: "from-purple-400 to-purple-600",
  },
  {
    question: "Is my capital safe?",
    answer: "We prioritize capital preservation. Our algorithms include strict risk management protocols, including stop-loss orders and dynamic position sizing. Additionally, funds are held in segregated accounts with regulated brokers.",
    icon: Shield,
    color: "from-emerald-400 to-emerald-600",
  },
  {
    question: "Do I need trading experience?",
    answer: "Not at all. Our system is fully automated. Once you set up your account and deposit funds, our algorithms handle all the trading decisions, execution, and management for you.",
    icon: BookOpen,
    color: "from-cyan-400 to-cyan-600",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-12 sm:py-16 md:py-20 relative">
      <div className="w-[95vw] md:w-[85vw] mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30">
              <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 mb-3 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base px-4">
            Everything you need to know about getting started with Titans Trading.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="mobile-card crm-card overflow-hidden interactive-element group"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                {(() => {
                  const Icon = faq.icon;
                  return (
                    <div className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-br ${faq.color} bg-opacity-10 border border-cyan-400/20 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        faq.color.includes('emerald') ? 'text-emerald-400' :
                        faq.color.includes('blue') ? 'text-blue-400' :
                        faq.color.includes('purple') ? 'text-purple-400' :
                        'text-cyan-400'
                      }`} />
                    </div>
                  );
                })()}
                <span className="text-base sm:text-lg font-medium text-white pr-4 text-left flex-1">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-neutral-300 text-sm sm:text-base leading-relaxed border-t border-white/5 pt-3 sm:pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
