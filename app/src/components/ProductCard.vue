<template>
  <router-link :to="`/product/${product.publicKeyBase58}`">
    <div class="card">
      <h2>
        {{ product.name }}
      </h2>
      <!-- <p>Owner : {{ owner }}</p> -->
      <p>
        Price : {{ product.priceEther }}
        {{ product.tokenSymbol }}
      </p>
      <!-- <p>Locktime : {{ lockTime }}</p> -->
      <p v-if="!!product.trackingId">Tracking ID : {{ product.trackingId }}</p>
    </div>
  </router-link>
</template>
<script setup>
import { toRefs, computed } from "vue";
import { Product } from "@/models";
import { getTokenSymbolByMintAddress } from "@/utils";

const props = defineProps({
  product: Product,
});

const { product } = toRefs(props);
</script>
<style scoped>
.card {
  border: 1px solid #ccc;
  width: 90%;
  margin: 1rem;
}
</style>
