<template>
  <div>
    <section class="token-section">
      <button class="token-btn" @click="toggleHideAccountSummary">
        {{ hideAccountSummary ? "show" : "hide" }}
      </button>
      <account-summary
        v-if="!hideAccountSummary"
        :search-term="searchTerm"
        @search="(_search) => (searchTerm = _search)"
      />
    </section>
    <section class="option-section">
      <p
        :class="`option ${index === selectedModeIndex ? 'active' : ''}`"
        v-for="(mode, index) in modes"
        @click="changeMode(index)"
        :key="mode.name"
      >
        {{ mode.name }} ({{ mode.amount }})
      </p>
    </section>
    <section class="tabs">
      <p
        :class="`tab ${index === selectedTabIndex ? 'active' : ''}`"
        v-for="(tab, index) in subTabs"
        @click="changeTab(index)"
        :key="tab.name"
      >
        {{ tab.name }} ( {{ tab.amount }} )
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
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { useWorkspace } from "@/composables";

const store = useStore();
const workspace = useWorkspace();
const hideAccountSummary = ref(false);
const searchTerm = ref("");
const { query } = useRoute();

const toggleHideAccountSummary = () => {
  hideAccountSummary.value = !hideAccountSummary.value;
};
const myProducts = computed(() => store.getters["products/myProducts"]);
const myPurchase = computed(() => store.getters["products/myPurchase"]);
const myInitiateProducts = computed(
  () => store.getters["products/myInitiateProducts"]
);
const myWaitingForShipmentProducts = computed(
  () => store.getters["products/myWaitingForShipmentProducts"]
);
const myShippingProducts = computed(
  () => store.getters["products/myShippingProducts"]
);
const myDeliveredProducts = computed(
  () => store.getters["products/myDeliveredProducts"]
);

const myWaitingForShipmentPurchase = computed(
  () => store.getters["products/myWaitingForShipmentPurchase"]
);
const myShippingPurchase = computed(
  () => store.getters["products/myShippingPurchase"]
);
const myDeliveredPurchase = computed(
  () => store.getters["products/myDeliveredPurchase"]
);

const items = computed(() => {
  if (selectedModeIndex.value === 0) {
    switch (selectedTabIndex.value) {
      case 0:
        return myInitiateProducts.value;
      case 1:
        return myWaitingForShipmentProducts.value;
      case 2:
        return myShippingProducts.value;
      case 3:
        return myDeliveredProducts.value;
    }
  }
  switch (selectedTabIndex.value) {
    case 0:
      return myWaitingForShipmentPurchase.value;
    case 1:
      return myShippingPurchase.value;
    default:
      return myDeliveredPurchase.value;
  }
});

const modes = [
  { name: "My Product", amount: myProducts.value.length },
  { name: "My Purchase", amount: myPurchase.value.length },
];
const selectedModeIndex = ref(
  query.mode && +query.mode < modes.length ? +query.mode : 0
);
const subTabs = computed(() =>
  selectedModeIndex.value === 0
    ? [
        { name: "initiate", amount: myInitiateProducts.value.length },
        {
          name: "wait for shipment",
          amount: myWaitingForShipmentProducts.value.length,
        },
        {
          name: "shipment in progress",
          amount: myShippingProducts.value.length,
        },
        { name: "delivered", amount: myDeliveredProducts.value.length },
      ]
    : [
        {
          name: "wait for shipment",
          amount: myWaitingForShipmentPurchase.value.length,
        },
        {
          name: "shipment in progress",
          amount: myShippingPurchase.value.length,
        },
        { name: "delivered", amount: myDeliveredPurchase.value.length },
      ]
);
const selectedTabIndex = ref(
  query.tab && +query.tab < subTabs.value.length ? +query.tab : 0
);

const changeTab = (index) => {
  selectedTabIndex.value = index;
};

const changeMode = (index) => {
  selectedModeIndex.value = index;
  selectedTabIndex.value = 0;
};

watchEffect(() => {
  store.dispatch("products/filterProducts", workspace);
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
  position: relative;
}

.token-btn {
  position: absolute;
  top: 0px;
  right: 10px;
  padding: 1rem;
  border-radius: 50%;
  border: none;
}

.token-btn:hover {
  background: #f391e3;
  cursor: pointer;
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
