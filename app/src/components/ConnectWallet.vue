<template>
  <div class="btn">
    <wallet-modal-provider>
      <wallet-multi-button></wallet-multi-button>
    </wallet-modal-provider>
  </div>
</template>
<script setup>
import {
  WalletMultiButton,
  WalletModalProvider,
} from "@solana/wallet-adapter-vue-ui";
</script>
