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
import { computed } from "@vue/reactivity";

const store = useStore();
const products = computed(() => store.getters["products/products"]);
</script>
<style scoped>
.product-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  text-align: center;
}
</style>
