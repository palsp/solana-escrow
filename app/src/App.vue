<template>
  <wallet-provider :wallets="wallets">
    <workspace-provider>
      <layout />
    </workspace-provider>
  </wallet-provider>
</template>

<script>
import {
  getPhantomWallet,
  getSolflareWallet,
} from "@solana/wallet-adapter-wallets";

import { WalletProvider } from "@solana/wallet-adapter-vue";
import WorkspaceProvider from "@/components/provider/WorkspaceProvider";
import Layout from "@/layouts/Layout.vue";

export default {
  components: {
    WalletProvider,
    WorkspaceProvider,
    Layout,
  },
  setup() {
    const wallets = [getPhantomWallet(), getSolflareWallet()];

    return { wallets };
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
