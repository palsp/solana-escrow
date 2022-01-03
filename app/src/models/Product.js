export class Product {
  #publicKey;
  constructor(
    publicKey,
    { name = "", description = "", price = 0, lockPeriod = 0 } = {}
  ) {
    this.#publicKey = publicKey;
    this.name = name;
    this.description = description;
    this.price = price;
    this.lockPeriod = lockPeriod;
  }
  get publicKey() {
    return this.#publicKey ? this.#publicKey.toBase58() : null;
  }
}
