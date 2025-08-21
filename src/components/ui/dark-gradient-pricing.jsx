
import React from 'react';
import { Zap, BarChart3, Shield, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';



const FloatingElement= ({ children, delay = 0, className }) => {
  return (
    <div
      className={cn(
        "absolute animate-pulse opacity-30",
        className
      )}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: '3s'
      }}
    >
      {children}
    </div>
  );
};







const PricingCard = ({ className }) => {
  return (
    <div
      className={cn(
        'relative w-full max-w-md mx-auto',
        'bg-black/40 backdrop-blur-xl border border-cyan-500/30',
        'rounded-2xl p-8 shadow-2xl',
        'before:absolute before:inset-0 before:rounded-2xl',
        'before:bg-gradient-to-b before:from-cyan-500/10 before:to-blue-600/5',
        'before:pointer-events-none',
        className
      )}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-transparent to-blue-500/20 opacity-50" />
      
      <div className="relative z-10 text-center space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30">
            <span className="text-cyan-300 text-sm font-medium">PREMIUM PLAN</span>
          </div>
          <h2 className="text-3xl font-bold text-white">50/50 Profit Sharing</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-black/30 border border-cyan-500/20">
            <div className="text-cyan-300 text-sm font-medium mb-1">Minimum Investment</div>
            <div className="text-2xl font-bold text-white">$600</div>
          </div>
          
          <div className="p-4 rounded-xl bg-black/30 border border-cyan-500/20">
            <div className="text-cyan-300 text-sm font-medium mb-1">Withdraw Profit When</div>
            <div className="text-2xl font-bold text-white">&gt; $50</div>
          </div>
        </div>

        <button className="w-full py-4 px-6 rounded-xl font-bold text-lg text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-105">
          <span className="flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Invest Now
          </span>
        </button>
      </div>

      <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
};



const FeatureIcon = ({ icon, label, className }) => {
  return (
    <div className={cn(
      'flex flex-col items-center space-y-3 p-4',
      'bg-black/20 backdrop-blur-sm rounded-xl',
      'border border-cyan-500/20 hover:border-cyan-400/40',
      'transition-all duration-300 hover:scale-105',
      className
    )}>
      <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/30">
        <div className="text-cyan-300 w-6 h-6">
          {icon}
        </div>
      </div>
      <span className="text-cyan-200 text-sm font-medium text-center">{label}</span>
    </div>
  );
};

const FuturisticPricingSection= () => {
  const features = [
    { icon: <Zap className="w-6 h-6" />, label: 'Automated Trades' },
    { icon: <BarChart3 className="w-6 h-6" />, label: 'Real-time Reporting' },
    { icon: <Eye className="w-6 h-6" />, label: '24/7 Monitoring' },
    { icon: <Shield className="w-6 h-6" />, label: 'Secure & Transparent' },
  ];

  return (
    <div className=" w-full ">
      
      
     
      <div className=" z-10 flex flex-col items-center justify-center min-h-screen p-8 space-y-12">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent">
            FUTURE TRADING
          </h1>
          <p className="text-cyan-200/80 text-lg max-w-2xl mx-auto">
            Advanced AI-powered trading platform with cutting-edge technology
          </p>
        </div>

        <PricingCard />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full">
          {features.map((feature, index) => (
            <FeatureIcon
              key={index}
              icon={feature.icon}
              label={feature.label}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-30" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-30" />
    </div>
  );
};

export default FuturisticPricingSection;

