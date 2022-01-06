<template>
  <div class="product">
    <h1>
      {{ product.name.toUpperCase() }}
    </h1>

    <base-image
      :image-url="product.imageUrl"
      :styles="{ height: '40vh', width: '50%' }"
    />
    <h3>
      Price : {{ product.priceEther }}
      {{ product.tokenSymbol }}
    </h3>
    <!-- <p>Locktime : {{ lockTime }}</p> -->
    <h3>Stage : {{ product.stage }}</h3>
    <p v-if="!connected">Please Connect Wallet</p>

    <product-action
      v-else
      :show-buy="showBuy"
      :show-update-shipment="showUpdateShippingDetail"
      :show-withdraw="showWithdraw"
      :tracking-id="trackingID"
      @order="order"
      @tracking-change="(_trackingID) => (trackingID = _trackingID)"
      @update-tracking="updateTracking"
      @withdraw="withdraw"
    />
    <!-- <section v-if="showBuy" class="order-section">
      <base-button @click="order">BUY</base-button>
    </section>
    <section class="update-shipment-section">
      <div class="form-group" v-if="showUpdateShippingDetail">
        <label for="trackingID">TRACKING ID : </label>
        <input
          type="text"
          placeholder="tracking id......"
          v-model="trackingID"
        />
        <base-button @click="updateTracking">UPDATE TRACKING</base-button>
      </div>
    </section>
    <section v-if="showWithdraw" class="withdraw-section">
      <base-button @click="withdraw">Withdraw Fund</base-button>
    </section> -->
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
import { useStore } from "vuex";
import { useWallet } from "@solana/wallet-adapter-vue";

const route = useRoute();
const router = useRouter();
const workspace = useWorkspace();
const store = useStore();
const { notify } = useNotify();
const { connected } = useWallet();

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
  const txid = await updateShippingDetail(
    workspace,
    product.value,
    trackingID.value
  );
  confirmTransaction(workspace, txid, notify, () => {
    loadProduct(product.value.publicKeyBase58);
  });
}

async function withdraw() {
  const txid = await withdrawFund(workspace, product.value);
  confirmTransaction(workspace, txid, notify, () => {
    router.push("/");
  });
}
</script>
<style scoped>
.product {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
