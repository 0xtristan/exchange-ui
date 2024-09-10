"use client";

import { useState } from "react";
import TradingViewChart from "./components/TradingViewChart";
import Orderbook from "@/components/orderbook";
import React, { Suspense } from 'react';

const OrderEntry = React.lazy(() => import('@/components/order-entry'));
const PositionsTable = React.lazy(() => import('@/components/positions-table'));

export default function Home() {
  const [selectedPrice, setSelectedPrice] = useState<string>("");

  return (
    <div className="flex flex-col h-screen bg-black text-gray-300">
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
            <Suspense fallback={<div>Loading...</div>}>
              <PositionsTable />
            </Suspense>
          </div>
        </div>
        <div className="w-[20%] bg-black border-l border-gray-800">
          <Suspense fallback={<div>Loading...</div>}>
            <OrderEntry selectedPrice={selectedPrice} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
