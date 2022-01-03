<template>
  <div></div>
</template>
<script>
import { getProducts } from "@/api";
import { useWorkspace } from "@/composables";
export default {
  setup() {
    const workspace = useWorkspace();
    getProducts(workspace);
  },
};
</script>
<style lang=""></style>
