<template>
  <form class="form" @submit.prevent="submit">
    <div class="form-group">
      <label for="image">Image: </label>
      <input id="image" type="file" accept="image/*" />
    </div>

    <div class="form-group">
      <label for="name">Name: </label>
      <input :class="nameClass" id="name" type="text" v-model="product.name" />
      <p :class="charLimitClass">{{ charLimit }}</p>
    </div>
    <div>
      <p class="error-text" v-if="nameError">
        name must have at least 1 and not more than 20 characters
      </p>
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
      <input
        :class="priceClass"
        id="price"
        type="number"
        v-model="product.price"
      />
    </div>
    <p class="error-text" v-if="priceError">price must be greater than 0</p>

    <div class="form-group">
      <label for="lockPeriod">Lock Period: </label>
      <input id="lockPeriod" type="number" v-model="product.lockPeriod" />
    </div>

    <button class="btn">Submit</button>
  </form>
</template>
<script setup>
import { computed, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Product } from "@/models";
import { createProduct } from "@/api";
import {
  useWorkspace,
  useCountCharacterLimit,
  useFormInput,
} from "@/composables";
import { mintAddress } from "@/dummy-data";

const workspace = useWorkspace();
const router = useRouter();
const store = useStore();

const product = reactive(new Product());
const { name, price } = toRefs(product);
const charLimit = useCountCharacterLimit(name, 20);

const [nameError, nameClass] = useFormInput(
  name,
  (_name) => _name.length <= 20 && _name.length > 0
);
const [priceError, priceClass] = useFormInput(price, (_price) => _price > 0);

const charLimitClass = computed(() => {
  return nameError.value ? "char-limit error-text" : "char-limit";
});

async function submit() {
  await createProduct(workspace, product, mintAddress);
  await store.dispatch("products/refresh", workspace);
  router.push("/");
}
</script>
<style scoped>
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.error {
  border: 1px solid red;
}

.error-text {
  color: red;
}

.char-limit {
  position: absolute;
  bottom: -33px;
  right: 20px;
}

.btn {
  margin-top: 2rem;
  padding: 0.5rem;
  width: 30%;
}
.form-group {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 1rem;
  text-align: left;
  margin: 1rem;
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
