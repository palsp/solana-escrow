<template>
  <div>
    <h2>
      {{ product.name }}
    </h2>
    <!-- <p>Owner : {{ owner }}</p> -->
    <p>
      Price : {{ product.priceEther }}
      {{ product.tokenSymbol }}
    </p>
    <!-- <p>Locktime : {{ lockTime }}</p> -->
    <p>Stage : {{ product.stage }}</p>

    <button v-if="showBuy" @click="order">BUY</button>
  </div>
</template>
<script setup>
import { ref, watchEffect, computed } from "vue";
import { useRoute } from "vue-router";
import { getProductByID } from "@/api";
import { useWorkspace } from "@/composables";
import { Product } from "@/models";
import { createOrder } from "@/api";

const route = useRoute();
const workspace = useWorkspace();

const product = ref(new Product());

const isSeller = computed(() => {
  if (!workspace.wallet.value || !product.value.seller) return false;

  return workspace.wallet.value.publicKey.equals(product.value.seller);
});

const showBuy = computed(
  () => !isSeller.value && product.value?.stage === "initiate"
);

watchEffect(async () => {
  if (route.params.pubkey) {
    product.value = await getProductByID(workspace, route.params.pubkey);
  }
});

async function order() {
  await createOrder(workspace, product.value);
}
</script>
<style scoped></style>
