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
    <section v-if="showBuy" class="order-section">
      <button @click="order">BUY</button>
    </section>
    <section class="update-shipment-section">
      <div class="form-group" v-if="showUpdateShippingDetail">
        <label for="trackingID">TRACKING ID : </label>
        <input
          type="text"
          placeholder="tracking id......"
          v-model="trackingID"
        />
        <button @click="updateTracking">UPDATE TRACKING</button>
      </div>
    </section>
    <section v-if="showWithdraw" class="withdraw-section">
      <button @click="withdraw">Withdraw Fund</button>
    </section>
  </div>
</template>
<script setup>
import { ref, watchEffect, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getProductByID } from "@/api";
import { useWorkspace, useNotify } from "@/composables";
import { Product } from "@/models";
import { createOrder, updateShippingDetail, withdrawFund } from "@/api";
import { confirmTransaction } from "@/utils";

const route = useRoute();
const router = useRouter();
const workspace = useWorkspace();
const { notify } = useNotify();

const product = ref(new Product());
const trackingID = ref("");

const isSeller = computed(() => {
  if (!workspace.wallet.value || !product.value.seller) return false;

  return workspace.wallet.value.publicKey.equals(product.value.seller);
});

const showBuy = computed(
  () => !isSeller.value && product.value?.stage === "initiate"
);

const showUpdateShippingDetail = computed(
  () => isSeller.value && product.value?.stage === "waitForShipping"
);

const showWithdraw = computed(
  () => isSeller.value && product.value?.stage === "delivered"
);

watchEffect(async () => {
  if (route.params.pubkey) {
    await loadProduct(route.params.pubkey);
  }
});

async function loadProduct(pubkey) {
  product.value = await getProductByID(workspace, pubkey);
}

async function order() {
  const txid = await createOrder(workspace, product.value);
  confirmTransaction(workspace, txid, notify, () => {
    loadProduct(product.value.publicKeyBase58);
  });
}

async function updateTracking() {
  await updateShippingDetail(workspace, product.value, trackingID.value);
  await loadProduct(product.value.publicKeyBase58);
}

async function withdraw() {
  await withdrawFund(workspace, product.value);
  router.push("/");
}
</script>
<style scoped></style>
