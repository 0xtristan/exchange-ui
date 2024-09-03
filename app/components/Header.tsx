"use client";

import React from "react";
import dynamic from "next/dynamic";

const LoginButton = dynamic(() => import("./LoginButton"), { ssr: false });

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">Exchange UI (Cursor + v0)</h1>
      <LoginButton />
    </header>
  );
};

export default Header;
