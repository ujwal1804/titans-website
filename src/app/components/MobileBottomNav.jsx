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
            <Link 
              key={item.name} 
              href={item.href}
              prefetch={true}
              className="focus:outline-none focus:ring-0 active:bg-transparent focus-visible:outline-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 relative focus:outline-none focus:ring-0 active:bg-transparent focus-visible:outline-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
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

