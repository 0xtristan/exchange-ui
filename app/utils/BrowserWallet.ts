import { Wallet, PublicKey, bytesToHex } from "@zetamarkets/zetax-sdk";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";

export class BrowserWallet extends Wallet {
  private walletAdapter: WalletContextState;

  constructor(publicKey: PublicKey, walletAdapter: WalletContextState) {
    super(publicKey);
    this.walletAdapter = walletAdapter;
  }

  static fromWalletAdapter(
    walletAdapter: WalletContextState
  ): BrowserWallet | null {
    if (!walletAdapter.publicKey) {
      return null;
    }
    return new BrowserWallet(
      bytesToHex(walletAdapter.publicKey.toBytes()),
      walletAdapter
    );
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    if (!this.walletAdapter.signTransaction) {
      throw new Error("Wallet does not support transaction signing");
    }
    return await this.walletAdapter.signTransaction(transaction);
  }

  async signAllTransactions(
    transactions: Transaction[]
  ): Promise<Transaction[]> {
    if (!this.walletAdapter.signAllTransactions) {
      throw new Error("Wallet does not support signing multiple transactions");
    }
    return await this.walletAdapter.signAllTransactions(transactions);
  }

  protected async signMessage(message: Uint8Array): Promise<Uint8Array> {
    if (!this.walletAdapter.signMessage) {
      throw new Error("Wallet does not support message signing");
    }
    return await this.walletAdapter.signMessage(message);
  }
}
