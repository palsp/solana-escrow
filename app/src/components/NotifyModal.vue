<template>
  <div v-if="showNotification" :class="`notify-modal ${status}`">
    <h1>{{ title }}</h1>
    <p v-if="isSuccess">
      Check your transaction
      <a :href="explorerUrl" target="_blank" rel="noopener noreferrer"> here</a>
    </p>
    <p v-else-if="isError">{{ errorMessage }}</p>
    <p v-else>Please wait for the confirmation</p>
    <button class="btn" @click="close">X</button>
  </div>
</template>
<script setup>
import { useNotify } from "@/composables";
import { computed } from "vue";
import { getTxExplorerUrl } from "@/utils";
const {
  showNotification,
  title,
  isSuccess,
  txid,
  isError,
  errorMessage,
  close,
} = useNotify();
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
<style scoped>
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

.btn {
  position: absolute;
  top: 0px;
  right: -0.5rem;
  padding: 0.25rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
}

.btn:hover {
  background: #f27272;
}
</style>
