<template>
  <div>
    <section class="token-section">
      <table class="token-table">
        <thead>
          <tr>
            <th>SYMBOL</th>
            <th>BALANCE</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="[mintAddress, tokenAccount] in Object.entries(tokenAccounts)"
            :key="tokenAccount.tokenAccountAddress"
          >
            <td>
              {{ getTokenSymbolByMintAddress(mintAddress)?.symbol }}
            </td>

            <td>{{ tokenAccount.balance.toEther() }}</td>
            <!-- <td>{{ tokenAccount.tokenAccountAddress }}</td> -->
          </tr>
        </tbody>
      </table>
    </section>
    <section class="option-section">
      <p
        :class="`option ${index === selectedModeIndex ? 'active' : ''}`"
        v-for="(mode, index) in modes"
        @click="changeMode(index)"
        :key="mode"
      >
        {{ mode }}
      </p>
    </section>
    <section class="tabs">
      <p
        :class="`tab ${index === selectedTabIndex ? 'active' : ''}`"
        v-for="(tab, index) in subTabs"
        @click="changeTab(index)"
        :key="tab"
      >
        {{ tab }}
      </p>
    </section>
    <section class="product-section">
      <product-card
        v-for="item in items"
        :key="item.name"
        :product="item"
      ></product-card>
    </section>
  </div>
</template>
<script setup>
import { computed, watchEffect, ref } from "vue";
import { useStore } from "vuex";
import { useWorkspace } from "@/composables";
import { getTokenSymbolByMintAddress } from "@/utils";

const store = useStore();
const workspace = useWorkspace();

const items = computed(() => {
  if (selectedModeIndex.value === 0) {
    switch (selectedTabIndex.value) {
      case 0:
        return store.getters["products/myInitiateProducts"];
      case 1:
        return store.getters["products/myWaitingForShipmentProducts"];
      case 2:
        return store.getters["products/myShippingProducts"];
      case 3:
        return store.getters["products/myDeliveredProducts"];
    }
  }
  switch (selectedTabIndex.value) {
    case 0:
      return store.getters["products/myWaitingForShipmentPurchase"];
    case 1:
      return store.getters["products/myShippingPurchase"];
    default:
      return store.getters["products/myDeliveredPurchase"];
  }
});
const tokenAccounts = computed(() => store.getters["wallet/tokenAccounts"]);

const selectedModeIndex = ref(0);
const selectedTabIndex = ref(0);
const modes = ["My Product", "My Purchase"];
const subTabs = computed(() =>
  selectedModeIndex.value === 0
    ? ["initiate", "wait for shipment", "shipment in progress", "delivered"]
    : ["wait for shipment", "shipment in progress", "delivered"]
);

const changeTab = (index) => {
  selectedTabIndex.value = index;
};

const changeMode = (index) => {
  selectedModeIndex.value = index;
};

watchEffect(() => {
  store.dispatch("products/getMyPurchase", workspace);
  store.dispatch("products/getMyProducts", workspace);
});
</script>
<style scoped>
section {
  margin: 5rem 0;
}
.token-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.token-table {
  margin: 1rem;
}

.option-section,
.tabs {
  display: flex;
  align-items: center;
  justify-content: center;
}

.option,
.tab {
  margin: 0 1rem;
}

.option:hover,
.tab:hover,
.active {
  cursor: pointer;
  color: #f391e3;
}
.product-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  text-align: center;
}
</style>
