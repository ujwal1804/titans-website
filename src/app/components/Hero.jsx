import Typeanimation from "@/components/ui/typeanimation";

export default function Hero() {
  return (
    <div className="flex items-center justify-center w-full flex-col px-4">
      <h2 className="bg-clip-text flex flex-col text-transparent text-center bg-gradient-to-b from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-white text-4xl md:text-5xl lg:text-7xl  pb-1 md:pb-2 pt-2 md:pt-4 relative z-20 font-bold tracking-tight leading-tight">
        
        
        <Typeanimation
          words={[" Precision In Code"]}
          typingSpeed="50"
          deletingSpeed="slow"
          pauseDuration={1000}
          className=""
        />

        Power in Trades.
      </h2>
      <p className="max-w-xl mx-auto text-base md:text-2xl text-neutral-500 dark:text-neutral-400 text-center mt-2">
        Our AI-driven trading bot for MetaTrader 5 adapts to markets in real
        time. Tested, optimized, and built to multiply equity with precision.
      </p>
    </div>
  );
}
