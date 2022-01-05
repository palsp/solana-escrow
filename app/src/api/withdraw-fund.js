import { web3 } from "@project-serum/anchor";
import { findPDAAccount, findProductAccountAddress } from ".";
import { ESCROW_VAULT_SEED, NATIVE_SOL } from "../utils";

export const withdrawFund = async ({ wallet, program }, product) => {
  if (product.mint === NATIVE_SOL.mintAddress) {
    await withdrawSol({ wallet, program }, product);
    return;
  }
};
export const withdrawSol = async ({ wallet, program }, product) => {
  const [productAccount] = await findProductAccountAddress(
    product.seller,
    product.name,
    program.value.programId
  );
  const [pdaAccount] = await findPDAAccount(
    [Buffer.from(ESCROW_VAULT_SEED)],
    program.value.programId
  );

  await program.value.rpc.withdrawSol({
    accounts: {
      authority: wallet.value.publicKey,
      productAccount,
      pdaAccount,
      systemProgram: web3.SystemProgram.programId,
    },
  });
};
