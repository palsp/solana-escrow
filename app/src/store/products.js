import { getProducts } from "@/api";

export default {
  namespaced: true,
  state: {
    products: [],
  },
  getters: {
    products(state) {
      return state.products;
    },
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
  },
  actions: {
    async getProducts({ commit }, workspace) {
      const products = await getProducts(workspace);
      commit("setProducts", products);
    },
  },
};
