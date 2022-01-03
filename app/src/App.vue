<template>
  <wallet-provider :wallets="wallets">
    <workspace-provider>
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/new">New Product</router-link> |
        <connect-wallet></connect-wallet>
      </div>
      <router-view />
    </workspace-provider>
  </wallet-provider>
</template>

<script>
import {
  getPhantomWallet,
  getSolflareWallet,
} from "@solana/wallet-adapter-wallets";
import ConnectWallet from "@/components/ConnectWallet.vue";
import { WalletProvider } from "@solana/wallet-adapter-vue";
import WorkspaceProvider from "@/components/provider/WorkspaceProvider";
export default {
  components: { ConnectWallet, WalletProvider, WorkspaceProvider },
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
