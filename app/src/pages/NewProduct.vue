<template>
  <form class="form" @submit.prevent="submit">
    <div class="form-group">
      <label for="image">Image: </label>
      <input id="image" type="file" accept="image/*" />
    </div>

    <div class="form-group">
      <label for="name">Name: </label>
      <input id="name" type="text" v-model="product.name" />
    </div>

    <div class="form-group">
      <label for="description">Description: </label>
      <textarea
        id="description"
        cols="30"
        rows="8"
        v-model="product.description"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="price">Price: </label>
      <input id="price" type="number" v-model="product.price" />
    </div>

    <div class="form-group">
      <label for="lockPeriod">Lock Period: </label>
      <input id="lockPeriod" type="number" v-model="product.lockPeriod" />
    </div>

    <button class="btn">Submit</button>
  </form>
</template>
<script setup>
import { reactive } from "vue";
import { Product } from "@/models";
import { createProduct } from "@/api";
import { useWorkspace } from "@/composables";

const product = reactive(new Product());
const workspace = useWorkspace();
console.log(workspace);

async function submit() {
  await createProduct(
    workspace,
    product,
    "H6B3KvXqccrknUgb9Zfs6fRbcjJq1JYTSvZ6ndXwWUnQ"
  );
}
</script>
<style scoped>
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.btn {
  margin-top: 2rem;
  padding: 0.5rem;
  width: 30%;
}
.form-group {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  text-align: left;
  width: 50%;
}

.form-group input,
.form-group textarea {
  width: 70%;
  padding: 1rem;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
