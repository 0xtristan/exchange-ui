import {
  Wallet,
  PublicKey,
  bytesToHex,
  base58ToHex,
} from "@zetamarkets/zetax-sdk";
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

export class PrivyWallet extends Wallet {
  private provider: any;
  constructor(publicKey: PublicKey, provider: any) {
    const publicKeyHex = base58ToHex(publicKey);
    super(publicKeyHex);
    this.provider = provider;
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    throw new Error("Privy wallet does not support transaction signing");
  }

  async signAllTransactions(
    transactions: Transaction[]
  ): Promise<Transaction[]> {
    throw new Error(
      "Privy wallet does not support signing multiple transactions"
    );
  }

  protected async signMessage(message: Uint8Array): Promise<any> {
    const encodedMessage = Buffer.from(message).toString("base64");
    const { signature } = await this.provider.request({
      method: "signMessage",
      params: {
        message: encodedMessage,
      },
    });
  }
}
