"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExchangeConnection, Order } from "@zetamarkets/zetax-sdk";
import { BrowserWallet, PrivyWallet } from "@/app/utils/BrowserWallet";
import {
  usePrivy,
  useSolanaWallets,
  WalletWithMetadata,
} from "@privy-io/react-auth";
export const PositionsTable: React.FC = () => {
  const [positions, setPositions] = useState<
    {
      size: number;
      cost_of_trades: number;
      realized_pnl: number;
      asset: string;
    }[]
  >([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("positions");
  const { user, authenticated } = usePrivy();
  const { wallets } = useSolanaWallets();

  useEffect(() => {
    const fetchPositionsAndOrders = async () => {
      if (!authenticated) {
        console.log("Not authenticated");
        return;
      }

      if (!user) {
        console.log("User not logged in");
        return;
      }
      const wallet = user.linkedAccounts.find(
        (account): account is WalletWithMetadata =>
          account.type === "wallet" &&
          account.walletClientType === "privy" &&
          account.chainType === "solana"
      );
      if (!wallet) {
        console.log("No wallet found");
        return;
      }
      console.log(wallet);

      // For some reason provider coming up as zero
      // if (wallets.length === 0) {
      //   console.log("No solana wallets found");
      //   return;
      // }
      // const provider = await wallets[0]?.getProvider();
      // console.log(wallets[0]);
      // console.log(provider);
      const publicKey = wallet.address;
      const sovWallet = new PrivyWallet(publicKey, null);
      // const sovWallet = BrowserWallet.fromWalletAdapter(wallet);

      try {
        const exchange = new ExchangeConnection(
          "http://127.0.0.1",
          9080,
          12346
        );
        const cmaData = await exchange.getCrossMarginAccount(sovWallet.address);
        console.log(cmaData);
        if (cmaData) {
          const positionsData = Object.entries(
            cmaData.perp_positions || {}
          ).map(([asset, position]) => ({
            ...position,
            asset,
          }));
          const ordersData = Object.values(cmaData.orders || {})
            .flatMap((orders) => orders)
            .sort((a, b) => {
              // First, sort by order_id in descending order
              if (b.order_id !== a.order_id) {
                return Number(b.order_id) - Number(a.order_id);
              }
              // If order_ids are the same, sort by price (for limit orders)
              if (a.price !== b.price) {
                return b.price - a.price;
              }
              // If prices are the same, sort by size
              return b.size - a.size;
            });

          setPositions(positionsData);
          setOrders(ordersData);
        }
      } catch (error) {
        console.error("Error fetching positions and orders:", error);
      }
    };

    fetchPositionsAndOrders();
    const interval = setInterval(fetchPositionsAndOrders, 5000);

    return () => clearInterval(interval);
  }, [authenticated]);

  return (
    <div className="h-full w-full bg-black text-gray-300 p-2 flex flex-col">
      <nav className="flex items-center space-x-4 mb-2">
        <button
          className={`text-sm font-bold ${
            activeTab === "positions" ? "text-yellow-500" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("positions")}
        >
          Positions ({positions.length})
        </button>
        <button
          className={`text-sm font-bold ${
            activeTab === "orders" ? "text-yellow-500" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Orders ({orders.length})
        </button>
      </nav>

      <div className="flex-grow overflow-auto">
        {activeTab === "positions" && (
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="text-gray-400 py-1">Contracts</TableHead>
                <TableHead className="text-gray-400 py-1">Qty</TableHead>
                <TableHead className="text-gray-400 py-1">
                  Entry Price
                </TableHead>
                <TableHead className="text-gray-400 py-1">
                  Realized P&L
                </TableHead>
                <TableHead className="text-gray-400 py-1">Close By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position, index) => (
                <TableRow key={index} className="text-xs">
                  <TableCell className="py-1">
                    <span className="text-green-500">{position.asset}</span>
                    <span className="text-xs text-gray-400 ml-1">
                      Cross {"-"}x
                    </span>
                  </TableCell>
                  <TableCell className="text-green-500 py-1">
                    {position.size.toFixed(4)}
                  </TableCell>
                  <TableCell className="py-1">
                    {(position.cost_of_trades / position.size).toFixed(2)}
                  </TableCell>
                  <TableCell
                    className={`py-1 ${
                      position.realized_pnl >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {position.realized_pnl.toFixed(4)} USD
                  </TableCell>
                  <TableCell className="py-1">
                    <div className="flex space-x-1">
                      <Button
                        variant="secondary"
                        className="bg-gray-700 text-white text-xs py-0 px-2"
                      >
                        Limit
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-gray-700 text-white text-xs py-0 px-2"
                      >
                        Market
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {activeTab === "orders" && (
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="text-gray-400 py-1">Order ID</TableHead>
                <TableHead className="text-gray-400 py-1">Market</TableHead>
                <TableHead className="text-gray-400 py-1">Side</TableHead>
                <TableHead className="text-gray-400 py-1">Size</TableHead>
                <TableHead className="text-gray-400 py-1">Price</TableHead>
                <TableHead className="text-gray-400 py-1">Filled</TableHead>
                <TableHead className="text-gray-400 py-1">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow key={index} className="text-xs">
                  <TableCell className="py-1">{order.order_id}</TableCell>
                  <TableCell className="py-1">{order.asset}</TableCell>
                  <TableCell
                    className={`py-1 ${
                      order.side === "Bid" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {order.side === "Bid" ? "Buy" : "Sell"}
                  </TableCell>
                  <TableCell className="py-1">
                    {Number(order.size).toFixed(4)}
                  </TableCell>
                  <TableCell className="py-1">
                    {Number(order.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="py-1">
                    {Number(order.filled_size).toFixed(4)}
                  </TableCell>
                  <TableCell className="py-1">
                    <Button
                      variant="secondary"
                      className="bg-gray-700 text-white text-xs py-0 px-2"
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {activeTab === "orders" && orders.length === 0 && (
          <div className="text-center text-gray-400 py-4 text-sm">
            No active orders
          </div>
        )}
      </div>
    </div>
  );
};
