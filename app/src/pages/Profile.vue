<template>
  <div>
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

const store = useStore();
const workspace = useWorkspace();

const myProducts = computed(() => store.getters["products/myProducts"]);

watchEffect(() => {
  store.dispatch("products/getMyProducts", workspace);
});
</script>
<style scoped>
.option-section {
  display: flex;
  align-items: center;
  justify-content: center;
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
