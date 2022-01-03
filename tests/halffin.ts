import * as anchor from "@project-serum/anchor";

import { Program } from "@project-serum/anchor";
import { Halffin } from "../target/types/halffin";

import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

import * as assert from "assert";
import faker from "faker";

const Keypair = anchor.web3.Keypair;

describe("halffin", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  //@ts-ignore
  const program = anchor.workspace.Halffin as Program<Halffin>;

  let mint: Token;
  let sellerTokenAccount: anchor.web3.PublicKey;
  let buyerTokenAccount: anchor.web3.PublicKey;

  const buyer = Keypair.generate();

  const payer = Keypair.generate();
  const mintAuthority = Keypair.generate();

  const productPrice = new anchor.BN(1000);

  it("Is initialize escrow state", async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, 10000000000),
      "confirmed"
    );

    mint = await Token.createMint(
      provider.connection,
      payer,
      mintAuthority.publicKey,
      null,
      0,
      TOKEN_PROGRAM_ID
    );
    console.log("MINT ADDRESS: ", mint.publicKey.toBase58());
    buyerTokenAccount = await mint.createAccount(buyer.publicKey);

    sellerTokenAccount = await mint.createAccount(provider.wallet.publicKey);

    await mint.mintTo(
      buyerTokenAccount,
      mintAuthority.publicKey,
      [mintAuthority],
      productPrice.toNumber()
    );

    let _buyerTokenAccount = await mint.getAccountInfo(buyerTokenAccount);
    assert.ok(_buyerTokenAccount.amount.eq(productPrice));

    let _sellerTokenAccount = await mint.getAccountInfo(sellerTokenAccount);
    assert.ok(_sellerTokenAccount.amount.toNumber() == 0);
  });

  const productName = faker.commerce.productName().slice(0, 20);
  const nowBn = new anchor.BN(Date.now() / 1000);
  const lockPeriod = nowBn.add(new anchor.BN(5));

  it("initializes product account", async () => {
    const [productAccount, productAccountBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [provider.wallet.publicKey.toBuffer(), , Buffer.from(productName)],
        program.programId
      );

    await program.rpc.initializeProduct(
      productName,
      productAccountBump,
      productPrice,
      lockPeriod,
      {
        accounts: {
          authority: provider.wallet.publicKey,
          productAccount: productAccount,
          tokenToReceiveAccount: sellerTokenAccount,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
      }
    );

    const _productAccount = await program.account.product.fetch(productAccount);
    // console.log(_productAccount.name);
    const _name = String.fromCharCode.apply(null, _productAccount.name);
    assert.equal(_name.trim(), productName);
    assert.equal(_productAccount.bump, productAccountBump);
    assert.ok(_productAccount.seller.equals(provider.wallet.publicKey));
    assert.ok(_productAccount.buyer.equals(anchor.web3.PublicKey.default));
    assert.ok(_productAccount.mintPubkey.equals(mint.publicKey));
    assert.ok(
      _productAccount.tokenToReceiveAccountPubkey.equals(sellerTokenAccount)
    );
  });

  it("creates order", async () => {
    const [productAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [provider.wallet.publicKey.toBuffer(), , Buffer.from(productName)],
      program.programId
    );

    await program.rpc.createOrder({
      accounts: {
        buyer: buyer.publicKey,
        productAccount,
        tempTokenAccount: buyerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      signers: [buyer],
    });

    const _productAccount = await program.account.product.fetch(productAccount);
    assert.ok(_productAccount.buyer.equals(buyer.publicKey));

    const _buyerTokenAccount = await mint.getAccountInfo(buyerTokenAccount);
    assert.ok(_buyerTokenAccount.owner.equals(productAccount));
  });

  const trackingID = "HF12345678";
  it("updates shipping detail", async () => {
    const [productAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [provider.wallet.publicKey.toBuffer(), , Buffer.from(productName)],
      program.programId
    );
    await program.rpc.updateShippingDetail(trackingID, {
      accounts: {
        authority: provider.wallet.publicKey,
        productAccount,
      },
    });

    const _productAccount = await program.account.product.fetch(productAccount);
    const _trackingID = String.fromCharCode.apply(
      null,
      _productAccount.trackingId
    );
    assert.equal(trackingID, _trackingID.trim());

    await program.rpc.fulfillShippingDetail({
      accounts: {
        authority: provider.wallet.publicKey,
        productAccount,
      },
    });
  });

  it("withdraw the funds", async () => {
    const [productAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [provider.wallet.publicKey.toBuffer(), , Buffer.from(productName)],
      program.programId
    );

    await program.rpc.withdrawFund({
      accounts: {
        authority: provider.wallet.publicKey,
        productAccount,
        tempTokenAccount: buyerTokenAccount,
        sellerTokenToReceiveAccount: sellerTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });

    const _sellerTokenAccount = await mint.getAccountInfo(sellerTokenAccount);
    assert.ok(_sellerTokenAccount.amount.eq(productPrice));
    const _buyerTokenAccount = await mint.getAccountInfo(buyerTokenAccount);
    assert.ok(_buyerTokenAccount.amount.toNumber() == 0);
  });
});
