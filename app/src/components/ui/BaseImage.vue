<template>
  <div class="img" :style="{ backgroundImage: backgroundUri, ...styles }"></div>
</template>
<script setup>
import { computed, toRefs } from "vue";

const props = defineProps({
  imageUrl: String,
  styles: {
    default: {},
  },
});

const { imageUrl, styles } = toRefs(props);
const backgroundUri = computed(() => `url(${imageUrl.value})`);
</script>
<style scoped>
.img {
  width: 100%;
  height: 200px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-origin: border-box;
  background-clip: border-box;
}
</style>
