<template>
  <header class="header">
    <div>LOGO</div>
    <nav class="nav-items">
      <router-link class="nav-item" to="/">Home</router-link>
      <router-link class="nav-item" to="/about">About</router-link>
      <router-link v-if="connected" class="nav-item" to="/new"
        >New Product</router-link
      >
      <connect-wallet></connect-wallet>
    </nav>
  </header>
  <main>
    <router-view />
  </main>
</template>

<script>
import ConnectWallet from "@/components/ConnectWallet.vue";
import { watchEffect } from "vue";
import { useStore } from "vuex";
import { useWorkspace } from "@/composables";
import { useWallet } from "@solana/wallet-adapter-vue";

export default {
  components: { ConnectWallet },
  setup() {
    const workspace = useWorkspace();
    const store = useStore();
    const { connected } = useWallet();

    watchEffect(() => {
      store.dispatch("products/getProducts", workspace);
    });

    watchEffect(() => {
      store.dispatch("wallet/setConnected", connected.value);
    });

    return {
      connected,
    };
  },
};
</script>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-items {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.nav-item {
  margin: 1rem;
}

.nav-items a {
  color: black;
  text-decoration: none;
}

a:active,
a:hover,
a.router-link-active {
  color: #f391e3;
  border-bottom: 1px solid #f391e3;
}

main {
  margin-top: 10vh;
}
</style>
