"use client";

import React from "react";
import { WalletConnectButton } from "./WalletConnectButton";

export default function Header() {
  return (
    <header className="p-4 flex justify-between items-center bg-gray-800">
      <h1 className="text-xl font-bold">Rollup Demo</h1>
      <WalletConnectButton />
    </header>
  );
}
