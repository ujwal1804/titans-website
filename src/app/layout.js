import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from 'next/font/local';
import { GetStartedProvider } from "@/contexts/GetStartedContext";

const trenchThin = localFont({
  src: "./fonts/TrenchThin.otf",
  variable: "--font-trenchthin",
});

const aquire = localFont({
  src: "./fonts/Aquire.otf",
  variable: "--font-aquire",
});


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ttitans.com'),
  title: {
    default: "Titans Trading - AI-Powered Algorithmic Trading Bot | Automated Forex Trading",
    template: "%s | Titans Trading"
  },
  description: "Experience next-level algorithmic trading with Titans Trading bot. Automated forex trading with proven results, real-time performance tracking, and 24/5 live trading. Join thousands of successful traders.",
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
  authors: [{ name: "Titans Trading" }],
  creator: "Titans Trading",
  publisher: "Titans Trading",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ttitans.com',
    siteName: "Titans Trading",
    title: "Titans Trading - AI-Powered Algorithmic Trading Bot",
    description: "Experience next-level algorithmic trading with Titans Trading bot. Automated forex trading with proven results and real-time performance tracking.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ttitans.com'}/images.jpeg`,
        width: 1200,
        height: 630,
        alt: "Titans Trading - Automated Trading Bot",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Titans Trading - AI-Powered Algorithmic Trading Bot",
    description: "Experience next-level algorithmic trading with automated forex trading bot. Proven results and real-time performance tracking.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://ttitans.com'}/images.jpeg`],
    creator: "@titanstrading",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://ttitans.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${aquire.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GetStartedProvider>
          {children}
        </GetStartedProvider>
      </body>
    </html>
  );
}
