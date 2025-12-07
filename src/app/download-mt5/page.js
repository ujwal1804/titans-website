"use client";

import Navbar from "../components/Navbar";
import PageHero from "../components/PageHero";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";
import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import { 
  SiWindows,
  SiApple,
  SiLinux,
  SiAppstore,
  SiGoogleplay,
  SiHuawei
} from "react-icons/si";
import { FaGlobe } from "react-icons/fa";

export default function DownloadMT5Page() {
  const downloadOptions = [
    {
      category: "Desktop Platforms",
      items: [
        {
          name: "Windows",
          icon: SiWindows,
          description: "Full-featured desktop application for Windows",
          downloadUrl: "https://download.mql5.com/cdn/web/metaquotes.ltd/mt5/mt5setup.exe?utm_source=www.metatrader5.com&utm_campaign=download",
          fileSize: "~50 MB",
          color: "from-cyan-500/20 to-blue-500/20",
          borderColor: "border-cyan-400/50",
          hoverColor: "hover:from-cyan-500/30 hover:to-blue-500/30",
        },
        {
          name: "macOS",
          icon: SiApple,
          description: "Native macOS application for Mac users",
          downloadUrl: "https://download.mql5.com/cdn/web/metaquotes.ltd/mt5/MetaTrader5.pkg.zip?utm_source=www.metatrader5.com&utm_campaign=download.mt5.macos",
          fileSize: "~60 MB",
          color: "from-cyan-500/20 to-blue-500/20",
          borderColor: "border-cyan-400/50",
          hoverColor: "hover:from-cyan-500/30 hover:to-blue-500/30",
        },
        {
          name: "Linux",
          icon: SiLinux,
          description: "Linux version for advanced traders",
          downloadUrl: "https://www.mql5.com/en/articles/625?utm_source=www.metatrader5.com&utm_campaign=download.mt5.linux",
          fileSize: "~55 MB",
          color: "from-cyan-500/20 to-blue-500/20",
          borderColor: "border-cyan-400/50",
          hoverColor: "hover:from-cyan-500/30 hover:to-blue-500/30",
          isExternal: true,
        },
        {
          name: "Web Terminal",
          icon: FaGlobe,
          description: "Access MT5 directly from your browser - no installation required",
          downloadUrl: "https://web.metatrader.app/terminal?lang=en",
          fileSize: "No installation required",
          color: "from-cyan-500/20 to-blue-500/20",
          borderColor: "border-cyan-400/50",
          hoverColor: "hover:from-cyan-500/30 hover:to-blue-500/30",
          isExternal: true,
        },
      ],
    },
    {
      category: "Mobile Platforms",
      items: [
        {
          name: "iOS (App Store)",
          icon: SiAppstore,
          description: "Download from Apple App Store for iPhone and iPad",
          downloadUrl: "https://download.mql5.com/cdn/mobile/mt5/ios?hl=en&utm_source=www.metatrader5.com&utm_campaign=install.metaquotes",
          fileSize: "~100 MB",
          color: "from-cyan-500/20 to-blue-500/20",
          borderColor: "border-cyan-400/50",
          hoverColor: "hover:from-cyan-500/30 hover:to-blue-500/30",
          isExternal: true,
        },
        {
          name: "Android",
          icon: SiGoogleplay,
          description: "Download from Google Play Store",
          downloadUrl: "https://download.mql5.com/cdn/mobile/mt5/android?hl=en&utm_source=www.metatrader5.com&utm_campaign=install.metaquotes",
          fileSize: "~80 MB",
          color: "from-cyan-500/20 to-blue-500/20",
          borderColor: "border-cyan-400/50",
          hoverColor: "hover:from-cyan-500/30 hover:to-blue-500/30",
          isExternal: true,
        },
        {
          name: "App Gallery (Huawei)",
          icon: SiHuawei,
          description: "Download from Huawei App Gallery",
          downloadUrl: "https://download.mql5.com/cdn/mobile/mt5/android/app-gallery?hl=en&utm_source=www.metatrader5.com&utm_campaign=install.metaquotes",
          fileSize: "~80 MB",
          color: "from-cyan-500/20 to-blue-500/20",
          borderColor: "border-cyan-400/50",
          hoverColor: "hover:from-cyan-500/30 hover:to-blue-500/30",
          isExternal: true,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "MetaTrader 5",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": ["Windows", "macOS", "Linux", "iOS", "Android"],
            "description": "Download MetaTrader 5 (MT5) for Windows, Mac, iOS, and Android. Start trading with Titans Trading bot on the world's most popular trading platform.",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://ttitans.com"}/download-mt5`,
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free download"
            },
            "downloadUrl": [
              "https://download.mql5.com/cdn/web/metaquotes.ltd/mt5/mt5setup.exe?utm_source=www.metatrader5.com&utm_campaign=download",
              "https://download.mql5.com/cdn/web/metaquotes.ltd/mt5/MetaTrader5.pkg.zip?utm_source=www.metatrader5.com&utm_campaign=download.mt5.macos",
              "https://download.mql5.com/cdn/mobile/mt5/ios?hl=en&utm_source=www.metatrader5.com&utm_campaign=install.metaquotes",
              "https://download.mql5.com/cdn/mobile/mt5/android?hl=en&utm_source=www.metatrader5.com&utm_campaign=install.metaquotes"
            ]
          })
        }}
      />
      <main className="bg-black text-white min-h-screen pb-20 md:pb-0">
        <Navbar />
        <PageHero 
          title="Download MetaTrader 5" 
          subtitle="Choose your platform and start trading with our advanced trading bot"
        />
      
      <div className="w-[95vw] md:w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {downloadOptions.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-20 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              className="mb-12 text-left"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {section.category}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                if (!Icon) {
                  console.error(`Icon not found for ${item.name}`);
                  return null;
                }
                return (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: (sectionIndex * 0.1) + (itemIndex * 0.1),
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <div className="relative h-full">
                      {/* Glass morphism card */}
                      <div className="relative h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:border-cyan-400/50 hover:bg-black/50 hover:shadow-2xl hover:shadow-cyan-500/20 flex flex-col overflow-hidden">
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/5 group-hover:to-cyan-500/10 transition-all duration-500 rounded-3xl pointer-events-none"></div>
                        
                        {/* Content */}
                        <div className="relative z-10 flex flex-col h-full">
                          {/* Icon and External Link */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 backdrop-blur-sm group-hover:border-cyan-400/50 group-hover:scale-110 transition-all duration-300">
                                {Icon && <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:text-cyan-300 transition-colors duration-300" />}
                              </div>
                            </div>
                            {item.isExternal && (
                              <motion.div
                                whileHover={{ scale: 1.2, rotate: 45 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                <ExternalLink className="w-5 h-5 text-white/40 group-hover:text-cyan-400 transition-colors duration-300" />
                              </motion.div>
                            )}
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors duration-300">
                            {item.name}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-white/60 text-sm sm:text-base mb-6 flex-grow leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                            {item.description}
                          </p>
                          
                          {/* Footer with file size and download button */}
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 group-hover:border-cyan-400/30 transition-colors duration-300">
                            <span className="text-xs sm:text-sm text-white/50 font-medium group-hover:text-white/70 transition-colors duration-300">
                              {item.fileSize}
                            </span>
                            <motion.a
                              href={item.downloadUrl}
                              target={item.isExternal ? "_blank" : "_self"}
                              rel={item.isExternal ? "noopener noreferrer" : ""}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/70 transition-all duration-300 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-cyan-500/30 group-hover:shadow-xl group-hover:shadow-cyan-500/40"
                            >
                              <Download className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-y-[-2px] transition-transform duration-300" />
                              <span>{item.isExternal ? "Visit Store" : "Download"}</span>
                            </motion.a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 md:mt-24 relative"
        >
          {/* Background with glass effect */}
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 md:p-12 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-cyan-500/5 rounded-3xl pointer-events-none"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="mb-8 text-left">
                <h3 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  System Requirements
                </h3>
                <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                {[
                  {
                    title: "Windows",
                    items: ["Windows 7 or later", "2GB RAM minimum", "100MB free disk space", "Internet connection"],
                    icon: "🪟"
                  },
                  {
                    title: "macOS",
                    items: ["macOS 10.12 or later", "2GB RAM minimum", "100MB free disk space", "Internet connection"],
                    icon: "🍎"
                  },
                  {
                    title: "Linux",
                    items: ["Ubuntu 18.04 or later", "2GB RAM minimum", "100MB free disk space", "Wine (for running Windows version)"],
                    icon: "🐧"
                  },
                  {
                    title: "Mobile",
                    items: ["iOS 12.0 or later", "Android 5.0 or later", "50MB free storage", "Internet connection"],
                    icon: "📱"
                  }
                ].map((platform, index) => (
                  <motion.div
                    key={platform.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
                    className="group"
                  >
                    <div className="bg-black/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-cyan-400/30 transition-all duration-300 hover:bg-black/40">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{platform.icon}</span>
                        <h4 className="text-xl font-bold text-cyan-300 group-hover:text-cyan-400 transition-colors duration-300">
                          {platform.title}
                        </h4>
                      </div>
                      <ul className="space-y-2.5">
                        {platform.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-white/70 text-sm sm:text-base group-hover:text-white/90 transition-colors duration-300">
                            <span className="text-cyan-400 mt-1">▸</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
      <MobileBottomNav />
      </main>
    </>
  );
}

