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
          downloadUrl: "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/mt5setup.exe",
          fileSize: "~50 MB",
          color: "from-cyan-500/20 to-blue-500/20",
          borderColor: "border-cyan-400/50",
          hoverColor: "hover:from-cyan-500/30 hover:to-blue-500/30",
        },
        {
          name: "macOS",
          icon: SiApple,
          description: "Native macOS application for Mac users",
          downloadUrl: "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/mt5setup.dmg",
          fileSize: "~60 MB",
          color: "from-cyan-500/20 to-blue-500/20",
          borderColor: "border-cyan-400/50",
          hoverColor: "hover:from-cyan-500/30 hover:to-blue-500/30",
        },
        {
          name: "Linux",
          icon: SiLinux,
          description: "Linux version for advanced traders",
          downloadUrl: "https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/mt5setup.tar.gz",
          fileSize: "~55 MB",
          color: "from-cyan-500/20 to-blue-500/20",
          borderColor: "border-cyan-400/50",
          hoverColor: "hover:from-cyan-500/30 hover:to-blue-500/30",
        },
        {
          name: "Web Terminal",
          icon: FaGlobe,
          description: "Access MT5 directly from your browser - no installation required",
          downloadUrl: "https://www.metatrader5.com/en/web-platform",
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
          downloadUrl: "https://apps.apple.com/app/metatrader-5/id413251709",
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
          downloadUrl: "https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5",
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
          downloadUrl: "https://appgallery.huawei.com/app/C101320163",
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
    <main className="bg-black text-white min-h-screen pb-20 md:pb-0">
      <Navbar />
      <PageHero 
        title="Download MetaTrader 5" 
        subtitle="Choose your platform and start trading with our advanced trading bot"
      />
      
      <div className="w-[95vw] md:w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {downloadOptions.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent"
            >
              {section.category}
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                if (!Icon) {
                  console.error(`Icon not found for ${item.name}`);
                  return null;
                }
                return (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (sectionIndex * 0.1) + (itemIndex * 0.1) }}
                    className="group"
                  >
                    <div className={`bg-gradient-to-br ${item.color} backdrop-blur-sm border ${item.borderColor} rounded-2xl p-6 transition-all duration-300 ${item.hoverColor} hover:shadow-xl hover:shadow-cyan-500/20 h-full flex flex-col`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} border ${item.borderColor}`}>
                          {Icon && <Icon className="w-8 h-8 text-white" />}
                        </div>
                        {item.isExternal && (
                          <ExternalLink className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 text-white">{item.name}</h3>
                      <p className="text-white/70 text-sm mb-4 flex-grow">{item.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-white/50">{item.fileSize}</span>
                        <a
                          href={item.downloadUrl}
                          target={item.isExternal ? "_blank" : "_self"}
                          rel={item.isExternal ? "noopener noreferrer" : ""}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/70 transition-all duration-300 text-white font-medium text-sm"
                        >
                          <Download className="w-4 h-4" />
                          {item.isExternal ? "Visit Store" : "Download"}
                        </a>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-white">System Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
            <div>
              <h4 className="font-semibold mb-2 text-cyan-300">Windows</h4>
              <ul className="text-sm space-y-1">
                <li>• Windows 7 or later</li>
                <li>• 2GB RAM minimum</li>
                <li>• 100MB free disk space</li>
                <li>• Internet connection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-cyan-300">macOS</h4>
              <ul className="text-sm space-y-1">
                <li>• macOS 10.12 or later</li>
                <li>• 2GB RAM minimum</li>
                <li>• 100MB free disk space</li>
                <li>• Internet connection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-cyan-300">Linux</h4>
              <ul className="text-sm space-y-1">
                <li>• Ubuntu 18.04 or later</li>
                <li>• 2GB RAM minimum</li>
                <li>• 100MB free disk space</li>
                <li>• Wine (for running Windows version)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-cyan-300">Mobile</h4>
              <ul className="text-sm space-y-1">
                <li>• iOS 12.0 or later</li>
                <li>• Android 5.0 or later</li>
                <li>• 50MB free storage</li>
                <li>• Internet connection</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}

