import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => Promise<void>;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDeposit,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      alert("Please enter a valid deposit amount");
      return;
    }
    setIsDepositing(true);
    try {
      await onDeposit(depositAmount);
      setIsDepositing(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setAmount("");
      }, 2000);
    } catch (error) {
      setIsDepositing(false);
      alert("Deposit failed. Please try again.");
    }
  };

  const presetAmounts = [10, 50, 100, 500, 1000, 10000];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-none">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
            <p className="text-2xl font-bold mt-4">Deposit Successful!</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-4">
                Deposit USDC
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <Image
                  src="/usdc-logo.png"
                  alt="USDC"
                  width={48}
                  height={48}
                  className="mr-2"
                />
                <span className="text-4xl font-bold">{amount || "0"}</span>
              </div>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-center text-2xl bg-gray-800 border-none focus:ring-2 focus:ring-blue-500"
                disabled={isDepositing}
              />
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    variant="outline"
                    className="bg-gray-800 hover:bg-gray-700 border-none"
                    disabled={isDepositing}
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleDeposit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-bold relative"
                disabled={isDepositing}
              >
                {isDepositing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                    Depositing...
                  </div>
                ) : (
                  "Deposit USDC"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
