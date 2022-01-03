import { web3, BN } from "@project-serum/anchor";
import { getTokenAccounts, createAssociateTokenAccount } from "@/utils";
import { PublicKey } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export const createProduct = async (
  { wallet, program, connection },
  productData,
  mintAddress
) => {
  const [productAccount, productAccountBump] =
    await web3.PublicKey.findProgramAddress(
      [wallet.value.publicKey.toBuffer(), Buffer.from(productData.name)],
      program.value.programId
    );
  const tokenAccounts = await getTokenAccounts({ connection, wallet });

  let tokenAccount = tokenAccounts[mintAddress];
  let transactions = [];
  let tx = new web3.Transaction();
  if (!tokenAccount) {
    const _tokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey(mintAddress),
      wallet.value.publicKey
    );
    const createTokenAccountIX = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey(mintAddress),
      _tokenAccount,
      wallet.value.publicKey,
      wallet.value.publicKey
    );

    tokenAccount = {
      tokenAccountAddress: _tokenAccount.toBase58(),
    };

    // const tx = new web3.Transaction();
    tx.add(createTokenAccountIX);
    // await provider.value.send(tx);
    transactions.push(tx);
  }

  await program.value.rpc.initializeProduct(
    productData.name,
    productAccountBump,
    new BN(productData.price),
    new BN(productData.lockPeriod),
    {
      accounts: {
        authority: wallet.value.publicKey,
        productAccount,
        tokenToReceiveAccount: new PublicKey(tokenAccount.tokenAccountAddress),
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      },
      preInstructions: transactions,
    }
  );
  console.log("done");
};
