import "@solana/wallet-adapter-vue-ui/styles.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ProductCard from "@/components/ProductCard.vue";
import BaseImage from "@/components/ui/BaseImage.vue";

import AccountSummary from "@/components/AccountSummary.vue";

const app = createApp(App);

app.component("ProductCard", ProductCard);
app.component("BaseImage", BaseImage);

app.component("AccountSummary", AccountSummary);

app.use(store);
app.use(router);

app.mount("#app");
