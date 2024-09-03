"use client";

import React from "react";
import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const LoginButton: React.FC = () => {
  return <WalletMultiButtonDynamic />;
};

export default LoginButton;
