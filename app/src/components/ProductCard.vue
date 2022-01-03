<template>
  <div class="card">
    <h2>
      {{ product.name }}
    </h2>
    <!-- <p>Owner : {{ owner }}</p> -->
    <p>Price : {{ product.price }}</p>
    <!-- <p>Locktime : {{ lockTime }}</p> -->
    <!-- <p>Stage : {{ product.stage }}</p> -->
    <p v-if="!!product.trackingId">Tracking ID : {{ product.trackingId }}</p>
  </div>
</template>
<script setup>
import { toRefs } from "vue";
import { Product } from "@/models";

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
