"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Asset, Client, Side } from "@zetamarkets/zetax-sdk";
import { PrivyWallet } from "@/app/utils/BrowserWallet";
import { toast } from "react-toastify";
import DepositModal from "./DepositModal";
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth";

interface OrderEntryProps {
  selectedPrice: string;
}

const OrderEntry: React.FC<OrderEntryProps> = ({ selectedPrice }) => {
  const [marginBalance, setMarginBalance] = useState<number>(0);
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState(selectedPrice);
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [leverage, setLeverage] = useState<number>(1);
  const [client, setClient] = useState<Client | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const { ready, authenticated } = usePrivy();
  const { wallets } = useSolanaWallets();

  // Memoize the wallet
  const currentWallet = useMemo(() => wallets[0], [wallets]);

  useEffect(() => {
    setPrice(selectedPrice);
  }, [selectedPrice]);

  const initExchange = useCallback(async () => {
    if (!ready || !authenticated || !currentWallet) {
      console.log("Not ready for initialization");
      return;
    }

    const provider = await currentWallet.getProvider();
    const publicKey = currentWallet.address;
    console.log("Initializing exchange for", publicKey);

    const sovWallet = new PrivyWallet(publicKey, provider);

    try {
      const newClient = new Client("http://127.0.0.1", 9080, 12346, sovWallet);
      setClient(newClient);

      const cmaData = await newClient.exchange.getCrossMarginAccount(
        sovWallet.address
      );
      if (cmaData) {
        setMarginBalance(cmaData.scaled_deposits.SOL);
        setAvailableBalance(cmaData.scaled_deposits.SOL);
      }
    } catch (error) {
      console.error("Error initializing exchange:", error);
    }
  }, [ready, authenticated, currentWallet]);

  useEffect(() => {
    initExchange();
  }, [initExchange]);

  useEffect(() => {
    if (!authenticated) {
      setMarginBalance(0);
      setAvailableBalance(0);
      setClient(null);
    }
  }, [authenticated]);

  const calculateValue = (): string => {
    if (quantity && price) {
      return (parseFloat(quantity) * parseFloat(price)).toFixed(2);
    }
    return "-- / --";
  };

  const calculateCost = (): string => {
    if (quantity && price && leverage > 0) {
      const value = parseFloat(quantity) * parseFloat(price);
      const cost = value / leverage;
      return cost.toFixed(2);
    }
    return "-- / --";
  };

  const setQuantityPercentage = (percentage: number) => {
    const maxQuantity =
      (availableBalance * leverage) / parseFloat(price || "1");
    const newQuantity = ((maxQuantity * percentage) / 100).toFixed(4);
    setQuantity(newQuantity);
  };

  const placeOrder = async (side: Side) => {
    if (!client || !quantity || !price) {
      console.error("Missing required data for order placement");
      return;
    }

    try {
      const asset = Asset.SOL; // Assuming SOL as the asset, adjust if needed
      const size = parseFloat(quantity);
      const priceValue = parseFloat(price);

      const order = await client.placeOrder(asset, priceValue, size, side);
      console.log("Order placed successfully:", order);
      toast.success(
        `${side === Side.Bid ? "Buy" : "Sell"} order placed successfully`
      );
      setQuantity("");
      setPrice("");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        `Failed to place ${
          side === Side.Bid ? "buy" : "sell"
        } order. Please try again.`
      );
    }
  };

  const handleDeposit = async (depositAmount: number) => {
    if (!client) {
      console.error("Client not initialized");
      return;
    }

    try {
      const tx = await client.deposit(Asset.SOL, depositAmount);

      console.log("Deposit transaction:", tx);
      toast.success(`Successfully deposited ${depositAmount} USDC`);

      // Refresh balances
      const cmaData = await client.exchange.getCrossMarginAccount(
        client.provider.wallet.address
      );
      if (cmaData) {
        setMarginBalance(cmaData.scaled_deposits["SOL"]);
        setAvailableBalance(cmaData.scaled_deposits["SOL"]);
      }
    } catch (error) {
      console.error("Error depositing:", error);
      toast.error("Failed to deposit. Please try again.");
    }
  };

  return (
    <div className="w-full h-full bg-black text-white border-l border-gray-800 flex flex-col">
      <div className="flex-grow overflow-y-auto p-4">
        <h2 className="mb-4 font-bold">Trade</h2>
        <div className="flex justify-between mb-4 space-x-2">
          <Select onValueChange={(value) => setLeverage(parseFloat(value))}>
            <SelectTrigger className="w-1/2 bg-[#2b2b2b] text-white">
              <SelectValue placeholder="1x" />
            </SelectTrigger>
            <SelectContent className="bg-[#2b2b2b] text-white border-gray-700">
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="5">5x</SelectItem>
              <SelectItem value="10">10x</SelectItem>
              <SelectItem value="20">20x</SelectItem>
              <SelectItem value="50">50x</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => setOrderType(value as "limit" | "market")}
          >
            <SelectTrigger className="w-1/2 bg-[#2b2b2b] text-white">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent className="bg-[#2b2b2b] text-white border-gray-700">
              <SelectItem value="limit">Limit</SelectItem>
              <SelectItem value="market">Market</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="price-input"
            className="block text-xs text-gray-400 mb-1"
          >
            Price
          </label>
          <Input
            id="price-input"
            placeholder="Enter price in USD"
            className="w-full bg-[#2b2b2b] text-white mb-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={orderType === "market"}
          />
          <label
            htmlFor="size-input"
            className="block text-xs text-gray-400 mb-1"
          >
            Size
          </label>
          <Input
            id="size-input"
            placeholder="Enter size in SOL"
            className="w-full bg-[#2b2b2b] text-white"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="flex justify-between mb-4 space-x-1">
          <Button
            variant="ghost"
            className="flex-1 bg-[#2b2b2b] text-white text-xs px-1"
            onClick={() => setQuantityPercentage(25)}
          >
            25%
          </Button>
          <Button
            variant="ghost"
            className="flex-1 bg-[#2b2b2b] text-white text-xs px-1"
            onClick={() => setQuantityPercentage(50)}
          >
            50%
          </Button>
          <Button
            variant="ghost"
            className="flex-1 bg-[#2b2b2b] text-white text-xs px-1"
            onClick={() => setQuantityPercentage(75)}
          >
            75%
          </Button>
          <Button
            variant="ghost"
            className="flex-1 bg-[#2b2b2b] text-white text-xs px-1"
            onClick={() => setQuantityPercentage(100)}
          >
            100%
          </Button>
        </div>
        <div className="flex justify-between mb-4">
          <div className="text-muted-foreground">Value</div>
          <div className="text-white">{calculateValue()} USD</div>
        </div>
        <div className="flex justify-between mb-4">
          <div className="text-muted-foreground">Cost</div>
          <div className="text-white">{calculateCost()} USD</div>
        </div>
        <div className="flex items-center mb-4">
          <Checkbox id="take-profit" />
          <label htmlFor="take-profit" className="text-white ml-2">
            Take Profit / Stop Loss
          </label>
        </div>
        <div className="flex justify-between mb-4 space-x-2">
          <Button
            className="flex-1 bg-green-500 text-white"
            onClick={() => placeOrder(Side.Bid)}
          >
            Buy
          </Button>
          <Button
            className="flex-1 bg-red-500 text-white"
            onClick={() => placeOrder(Side.Ask)}
          >
            Sell
          </Button>
        </div>
      </div>
      <div className="border-t border-gray-600 p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-gray-500 text-xs">Initial Margin</div>
          <div className="text-gray-300 text-sm">
            <div className="bg-[#2b2b2b] h-2 rounded-full w-full relative">
              <div className="bg-green-500 h-full rounded-full w-[20%] absolute" />
            </div>
            <div className="text-right text-xs">20.00%</div>
          </div>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div className="text-gray-500 text-xs">Maintenance Margin</div>
          <div className="text-gray-300 text-sm">
            <div className="bg-[#2b2b2b] h-2 rounded-full w-full relative">
              <div className="bg-green-500 h-full rounded-full w-[10%] absolute" />
            </div>
            <div className="text-right text-xs">10.00%</div>
          </div>
        </div>
        <div className="flex justify-between mb-3">
          <div className="text-gray-500 text-xs">Margin Balance</div>
          <div className="text-gray-300 text-sm">
            {Number(marginBalance).toFixed(2)} USD
          </div>
        </div>
        <div className="flex justify-between space-x-2">
          <Button
            className="flex-1 bg-[#2b2b2b] text-white"
            onClick={() => setIsDepositModalOpen(true)}
          >
            Deposit
          </Button>
        </div>
      </div>
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onDeposit={handleDeposit}
      />
    </div>
  );
};

export default React.memo(OrderEntry);
