"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BarChart3, Sparkles, Info, DollarSign } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Features", href: "/features", icon: Sparkles },
    { name: "About", href: "/about", icon: Info },
    { name: "Pricing", href: "/pricing", icon: DollarSign },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl border-t border-white/10" />
      
      {/* Content */}
      <div className="relative flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 relative"
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-400/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Icon */}
                <div className="relative z-10">
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? "text-cyan-400" : "text-neutral-400"
                    }`}
                  />
                </div>
                
                {/* Label */}
                <span
                  className={`text-xs mt-1 transition-colors duration-200 relative z-10 ${
                    isActive ? "text-cyan-400 font-semibold" : "text-neutral-400"
                  }`}
                >
                  {item.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

