<template>
  <div>
    <section class="token-section">
      <table class="token-table">
        <thead>
          <tr>
            <th>SYMBOL</th>
            <th>BALANCE</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="[mintAddress, tokenAccount] in Object.entries(tokenAccounts)"
            :key="tokenAccount.tokenAccountAddress"
          >
            <td>
              {{ getTokenSymbolByMintAddress(mintAddress)?.symbol }}
            </td>
            <td>{{ tokenAccount.balance.toEther() }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section class="option-section">
      <p>My Product</p>
      <p>My Purchase</p>
    </section>
    <section class="product-section">
      <product-card
        v-for="product in myProducts"
        :key="product.name"
        :product="product"
      ></product-card>
    </section>
  </div>
</template>
<script setup>
import { computed, watchEffect } from "vue";
import { useStore } from "vuex";
import { useWorkspace } from "@/composables";
import { getTokenSymbolByMintAddress } from "@/utils";

const store = useStore();
const workspace = useWorkspace();

const myProducts = computed(() => store.getters["products/myProducts"]);
const tokenAccounts = computed(() => store.getters["wallet/tokenAccounts"]);
watchEffect(() => {
  store.dispatch("products/getMyProducts", workspace);
});
</script>
<style scoped>
section {
  margin: 5rem 0;
}
.token-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.token-table {
  margin: 1rem;
}

.option-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-section {
  display: flex;
}

.option-section p {
  margin: 0 1rem;
}
.product-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  text-align: center;
}
</style>
