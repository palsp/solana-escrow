export class Product {
  #publicKey;
  constructor(publicKey, productData) {
    this.#publicKey = publicKey;
    if (!productData) {
      this.name = "";
      this.description = "";
      this.price = 0;
      this.lockPeriod = 0;
    } else {
      this.name = String.fromCharCode.apply(null, productData.name).trim();
      this.price = productData.price;
      this.lockPeriod = productData.lockPeriod;
      this.seller = productData.seller;
      this.buyer = productData.buyer;
      this.stage = productData.stage;
      this.mint = productData.mintPubkey.toBase58();
    }
  }
  get publicKey() {
    return this.#publicKey ? this.#publicKey.toBase58() : null;
  }
}
