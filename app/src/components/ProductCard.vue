<template>
  <div class="card">
    <h2>
      {{ product.name }}
    </h2>
    <!-- <p>Owner : {{ owner }}</p> -->
    <p>
      Price : {{ product.price }}
      {{ symbol }}
    </p>
    <!-- <p>Locktime : {{ lockTime }}</p> -->
    <!-- <p>Stage : {{ product.stage }}</p> -->
    <p v-if="!!product.trackingId">Tracking ID : {{ product.trackingId }}</p>
  </div>
</template>
<script setup>
import { toRefs, computed } from "vue";
import { Product } from "@/models";
import { getTokenSymbolByMintAddress } from "@/utils";

const props = defineProps({
  product: Product,
});

const { product } = toRefs(props);
const symbol = computed(() => {
  const token = getTokenSymbolByMintAddress(product.value.mint);
  return token ? token.symbol : null;
});
</script>
<style scoped>
.card {
  border: 1px solid #ccc;
  width: 90%;
  margin: 1rem;
}
</style>
