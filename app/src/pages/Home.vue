<template>
  <section class="product-section">
    <product-card
      v-for="product in products"
      :key="product.name"
      :product="product"
    />
  </section>
</template>
<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import { useWorkspace } from "@/composables";
import { stage } from "@/models";

const store = useStore();
const { wallet } = useWorkspace();

const products = computed(() => {
  let _products = store.getters["products/products"].filter(
    (product) => product.stage === stage.initiate
  );
  if (!wallet.value) return _products;

  return _products.filter(
    (product) => !product.seller.equals(wallet.value.publicKey)
  );
});
</script>
<style scoped>
.product-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  text-align: center;
}
</style>
