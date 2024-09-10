import { Wallet, PublicKey, base58ToHex } from "@zetamarkets/zetax-sdk";

export class PrivyWallet extends Wallet {
  private provider: any;
  constructor(publicKey: PublicKey, provider: any) {
    const publicKeyHex = base58ToHex(publicKey);
    super(publicKeyHex);
    this.provider = provider;
  }

  protected async signMessage(message: Uint8Array): Promise<any> {
    console.log("signMessage", message);
    const encodedMessage = Buffer.from(message).toString("base64");
    const { signature } = await this.provider.request({
      method: "signMessage",
      params: {
        message: encodedMessage,
      },
    });
    console.log("signature", signature);
    return Buffer.from(signature, "base64");
  }
}
