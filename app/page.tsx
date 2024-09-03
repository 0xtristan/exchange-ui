"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import TradingViewChart from "./components/TradingViewChart";
import { PositionsTable } from "@/components/trading-interface";
import Orderbook from "@/components/orderbook";
import OrderEntry from "@/components/order-entry";

const Header = dynamic(() => import('./components/Header'), { ssr: false });

export default function Home() {
  const [selectedPrice, setSelectedPrice] = useState<string>('');

  return (
    <div className="flex flex-col h-screen bg-black text-gray-300">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="flex w-[80%] flex-col">
          <div className="flex h-[70%]">
            <div className="w-3/4 bg-black">
              <TradingViewChart />
            </div>
            <div className="w-1/4 bg-black border-l border-gray-800">
              <Orderbook onPriceSelect={setSelectedPrice} />
            </div>
          </div>
          <div className="h-[30%] w-full bg-black border-t border-gray-800">
            <PositionsTable />
          </div>
        </div>
        <div className="w-[20%] bg-black border-l border-gray-800">
          <OrderEntry selectedPrice={selectedPrice} />
        </div>
      </main>
    </div>
  );
}
