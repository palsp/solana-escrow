import { getProducts, sellerFilter } from "@/api";
import { getTokenAccounts } from "@/utils";
export default {
  namespaced: true,
  state: {
    products: [],
    myProducts: [],
  },
  getters: {
    products(state) {
      return state.products;
    },
    myProducts(state) {
      return state.myProducts;
    },
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    setMyProducts(state, myProducts) {
      state.myProducts = myProducts;
    },
  },
  actions: {
    async getProducts({ commit }, workspace) {
      const products = await getProducts(workspace);
      commit("setProducts", products);
    },
    async getMyProducts({ commit }, workspace) {
      const myProducts = await getProducts(workspace, [
        sellerFilter(workspace.wallet.value.publicKey.toBase58()),
      ]);
      commit("setMyProducts", myProducts);
    },
    async refresh({ dispatch }, workspace) {
      await Promise.all([
        dispatch("getProducts", workspace),
        dispatch("getMyProducts", workspace),
      ]);
    },
  },
};
