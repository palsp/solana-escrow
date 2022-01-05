import { getProducts, sellerFilter, buyerFilter } from "@/api";
import { getTokenAccounts } from "@/utils";
import { stage } from "../models";
export default {
  namespaced: true,
  state: {
    products: [],
    myProducts: [],
    myPurchase: [],
  },
  getters: {
    products(state) {
      return state.products;
    },
    myProducts(state) {
      return state.myProducts;
    },
    myPurchase(state) {
      return state.myPurchase;
    },

    myInitiateProducts(state) {
      return state.myProducts.filter(
        (product) => product.stage === stage.initiate
      );
    },

    myWaitingForShipmentProducts(state) {
      return state.myProducts.filter(
        (product) => product.stage === stage.waitForShipping
      );
    },

    myShippingProducts(state) {
      return state.myProducts.filter(
        (product) => product.stage === stage.shippingInProgress
      );
    },

    myDeliveredProducts(state) {
      return state.myProducts.filter(
        (product) => product.stage === stage.delivered
      );
    },

    myWaitingForShipmentPurchase(state) {
      return state.myPurchase.filter(
        (product) => product.stage === stage.waitForShipping
      );
    },
    myShippingPurchase(state) {
      return state.myPurchase.filter(
        (product) => product.stage === stage.shippingInProgress
      );
    },

    myDeliveredPurchase(state) {
      return state.myPurchase.filter(
        (product) => product.stage === stage.delivered
      );
    },
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    setMyProducts(state, myProducts) {
      state.myProducts = myProducts;
    },
    setMyPurchase(state, myPurchase) {
      state.myPurchase = myPurchase;
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
    async getMyPurchase({ commit }, workspace) {
      const myPurchase = await getProducts(workspace, [
        buyerFilter(workspace.wallet.value.publicKey.toBase58()),
      ]);

      commit("setMyPurchase", myPurchase);
    },
  },
};
