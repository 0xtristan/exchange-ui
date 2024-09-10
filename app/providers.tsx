"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cm0lxfo5u001xfx9ly2m7lzr7"
      config={{
        appearance: {
          accentColor: "#38CCCD",
          theme: "#222224",
          showWalletLoginFirst: false,
          // logo: "https://pub-dc971f65d0aa41d18c1839f8ab426dcb.r2.dev/privy-dark.png",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        loginMethods: [
          "email",
          "wallet",
          "google",
          // "apple",
          "twitter",
          // "discord",
          // "telegram",
        ],
      }}
    >
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="bg-gray-800 text-white"
        progressClassName="bg-blue-500"
      />
    </PrivyProvider>
  );
}
