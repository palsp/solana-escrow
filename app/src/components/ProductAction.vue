<template v-else>
  <section v-if="showBuy" class="order-section">
    <base-button @click="$emit('order')">BUY</base-button>
  </section>
  <section class="update-shipment-section" v-if="showUpdateShipment">
    <div class="form-group">
      <label for="trackingID">TRACKING ID : </label>
      <input
        type="text"
        placeholder="tracking id......"
        :value="trackingId"
        @input="$emit('tracking-change', $event.target.value)"
      />
    </div>
    <base-button @click="$emit('update-tracking')">UPDATE TRACKING</base-button>
  </section>
  <section v-if="showWithdraw" class="withdraw-section">
    <base-button @click="$emit('withdraw')">Withdraw Fund</base-button>
  </section>
</template>

<script>
import { toRefs, context } from "vue";
export default {
  props: ["showBuy", "showUpdateShipment", "showWithdraw", "trackingId"],
  emit: ["order", "update-tracking", "withdraw", "tracking-change"],
  setup(props, context) {
    return {
      ...toRefs(props),
    };
  },
};
</script>

<style scoped>
.update-shipment-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  margin: 2rem 0;
}

.form-group input {
  padding: 0.5rem;
}
</style>
