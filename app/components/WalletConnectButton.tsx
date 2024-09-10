"use client";

import {
  usePrivy,
  useLogin,
  useSolanaWallets,
  Wallet,
  WalletWithMetadata,
} from "@privy-io/react-auth";

export function WalletConnectButton() {
  const { logout, authenticated, user } = usePrivy();
  const { createWallet } = useSolanaWallets();

  const { login } = useLogin({
    onComplete: async (user) => {
      let solanaWallet: Wallet | undefined = user.linkedAccounts.find(
        (account): account is WalletWithMetadata =>
          account.type === "wallet" && account.chainType === "solana"
      );

      if (!solanaWallet) {
        solanaWallet = await createWallet();
        console.log("Created Solana wallet", solanaWallet);
      }
    },
  });

  if (authenticated && user) {
    // Get static solana wallet object for the address
    const wallet = user.linkedAccounts.find(
      (account): account is WalletWithMetadata =>
        account.type === "wallet" &&
        account.walletClientType === "privy" &&
        account.chainType === "solana"
    );
    return (
      <button
        onClick={logout}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Disconnect {wallet?.address?.slice(0, 6)}...
      </button>
    );
  }

  return (
    <button
      onClick={login}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    >
      Connect Wallet
    </button>
  );
}
