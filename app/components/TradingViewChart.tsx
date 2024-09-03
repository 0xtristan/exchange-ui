"use client";

import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: "BINANCE:SOLUSDT",
          interval: "60",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#000000", // Changed to black
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          backgroundColor: "#000000", // Added black background
          gridColor: "#1a1a1a", // Darker grid color
          studies: [
            { id: "MAExp@tv-basicstudies", inputs: { length: 21 } },
            { id: "MAExp@tv-basicstudies", inputs: { length: 50 } },
          ],
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div id="tradingview_chart" ref={containerRef} className="w-full h-full" />
  );
};

export default TradingViewChart;
