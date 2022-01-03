import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/pages/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/new",
    name: "NewProduct",
    component: require("@/pages/NewProduct.vue").default,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
