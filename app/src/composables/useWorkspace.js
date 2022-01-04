import { inject, provide, computed } from "vue";
import { useAnchorWallet } from "@solana/wallet-adapter-vue";
import idl from "@/idl/halffin.json";
import { Provider, Program } from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

// const clusterUrl = process.env.VUE_APP_CLUSTER_URL;
const clusterUrl = "http://127.0.0.1:8899";
const preflightCommitment = "processed";
const commitment = "processed";
const programID = new PublicKey(idl.metadata.address);

const workspaceSymbol = Symbol("Workspace");

export const useWorkspace = () => inject(workspaceSymbol);

export const initWorkspace = () => {
  const wallet = useAnchorWallet();
  const connection = new Connection(clusterUrl, commitment);
  const provider = computed(
    () =>
      new Provider(connection, wallet.value, {
        preflightCommitment,
        commitment,
      })
  );

  const program = computed(() => new Program(idl, programID, provider.value));

  provide(workspaceSymbol, {
    wallet,
    connection,
    provider,
    program,
  });
};
