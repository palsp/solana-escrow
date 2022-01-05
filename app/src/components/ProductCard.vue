<template>
  <router-link :to="`/product/${product.publicKeyBase58}`">
    <div class="card">
      <h2 class="title">
        {{ name }}
      </h2>
      <base-image :image-url="product.imageUrl"></base-image>
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

const name = computed(() => {
  return product.value.name.toUpperCase();
});
</script>
<style scoped>
a {
  color: black;
  text-decoration: none;
}
.card {
  border: 1px solid #ccc;
  width: 20vw;
  height: 25vh;
  margin: 1rem;
  padding: 1rem;
}

.title {
  border-bottom: 1px solid black;
}
</style>
