import { web3, BN } from "@project-serum/anchor";
import { getTokenAccounts, createAssociateTokenAccount } from "@/utils";
import { PublicKey } from "@solana/web3.js";

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
  const transactions = [];
  if (!tokenAccount) {
    tokenAccount = await createAssociateTokenAccount(
      { wallet },
      mintAddress,
      transactions
    );
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
