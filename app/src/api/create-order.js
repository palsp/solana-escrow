import { web3 } from "@project-serum/anchor";
import { findPDAAccount, findProductAccountAddress } from ".";
import { ESCROW_VAULT_SEED, NATIVE_SOL } from "../utils";

export const createOrder = async ({ wallet, program, connection }, product) => {
  if (product.mint === NATIVE_SOL.mintAddress) {
    await createOrderOfSol({ wallet, program }, product);
    return;
  }
  const [productAccount] = findProductAccountAddress(
    product.seller,
    product.name,
    program.value.programId
  );
};

export const createOrderOfSol = async ({ wallet, program }, product) => {
  const [productAccount] = await findProductAccountAddress(
    product.seller,
    product.name,
    program.value.programId
  );

  const [pdaAccount] = await findPDAAccount(
    [Buffer.from(ESCROW_VAULT_SEED)],
    program.value.programId
  );

  await program.value.rpc.createOrderSol({
    accounts: {
      buyer: wallet.value.publicKey,
      productAccount,
      pdaAccount,
      systemProgram: web3.SystemProgram.programId,
    },
  });
};
