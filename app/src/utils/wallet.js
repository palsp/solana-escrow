import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { lt, TokenAmount } from "@/models";
import { NATIVE_SOL } from "./tokens";

export const getTokenAccounts = async ({ connection, wallet }) => {
  const parsedTokenAccount = await connection.getParsedTokenAccountsByOwner(
    wallet.value.publicKey,
    {
      programId: TOKEN_PROGRAM_ID,
    },
    "confirmed"
  );
  const tokenAccounts = {};
  parsedTokenAccount.value.forEach((tokenAccountInfo) => {
    const tokenAccountAddress = tokenAccountInfo.pubkey.toBase58();

    const parsedInfo = tokenAccountInfo.account.data.parsed.info;

    const mintAddress = parsedInfo.mint;

    const balance = new TokenAmount(
      parsedInfo.tokenAmount.amount,
      parsedInfo.tokenAmount.decimals
    );
    if (Object.prototype.hasOwnProperty.call(tokenAccounts, mintAddress)) {
      if (
        lt(
          tokenAccounts[mintAddress].balance.wei.toNumber(),
          balance.wei.toNumber()
        )
      ) {
        tokenAccounts[mintAddress] = {
          tokenAccountAddress,
          balance,
        };
      }
    } else {
      tokenAccounts[mintAddress] = {
        tokenAccountAddress,
        balance,
      };
    }
  });
  const solBalance = await connection.getBalance(
    wallet.value.publicKey,
    "confirmed"
  );
  tokenAccounts[NATIVE_SOL.mintAddress] = {
    tokenAccountAddress: wallet.value.publicKey.toBase58(),
    balance: new TokenAmount(solBalance, NATIVE_SOL.decimals),
  };

  return tokenAccounts;
};
