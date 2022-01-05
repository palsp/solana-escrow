<template>
  <div v-if="showNotification" :class="`notify-modal ${status}`">
    <h1>{{ title }}</h1>
    <p v-if="isSuccess">
      Check your transaction
      <a :href="explorerUrl" target="_blank" rel="noopener noreferrer"> here</a>
    </p>
    <p v-if="isError">{{ errorMessage }}</p>
  </div>
</template>
<script setup>
import { useNotify } from "@/composables";
import { computed } from "vue";
import { getTxExplorerUrl } from "@/utils";
const { showNotification, title, isSuccess, txid, isError, errorMessage } =
  useNotify();
const explorerUrl = computed(() => getTxExplorerUrl(txid.value));
const status = computed(() => {
  if (isSuccess.value) {
    return "success";
  } else if (isError.value) {
    return "error";
  } else {
    return "info";
  }
});
</script>
<style>
.notify-modal {
  position: fixed;
  height: 150px;
  bottom: 10px;
  left: 10px;
  border-radius: 1.5rem;
  color: white;
}

.notify-modal h1 {
  margin: 0 2rem;
  margin-top: 1rem;
  border-bottom: 1px solid white;
}

.notify-modal p {
  font-size: 1rem;
  font-weight: bold;
}
.success {
  background: #5ede62;
}

.error {
  background: #e74c3c;
}

.info {
  background: #3498db;
}
</style>
