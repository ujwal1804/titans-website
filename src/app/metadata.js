// SEO Metadata configuration
export const siteConfig = {
  name: "Titans Trading",
  description: "AI-Powered Algorithmic Trading Bot for Automated Forex Trading",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ttitans.com",
  ogImage: "/images.jpeg",
  links: {
    twitter: "https://twitter.com/titanstrading",
    github: "https://github.com/titanstrading",
  },
};

export const defaultMetadata = {
  title: {
    default: "Titans Trading - AI-Powered Algorithmic Trading Bot | Automated Forex Trading",
    template: "%s | Titans Trading"
  },
  description: "Experience next-level algorithmic trading with Titans Trading bot. Automated forex trading with proven results, real-time performance tracking, and 24/5 live trading.",
  keywords: [
    "algorithmic trading",
    "automated trading bot",
    "forex trading",
    "AI trading",
    "trading bot",
    "forex robot",
    "automated forex",
    "trading automation",
    "MT5 trading",
    "forex algorithm",
    "trading software",
    "forex signals",
    "automated trading system",
    "trading performance",
    "forex EA"
  ],
};

