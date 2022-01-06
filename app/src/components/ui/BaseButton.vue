<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<style scoped>
.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
}

.btn:hover {
  background-color: #f391e3;
  cursor: pointer;
}
</style>
