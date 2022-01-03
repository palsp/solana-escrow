export default {
  namespaced: true,
  state: {
    connected: false,
  },
  getters: {
    connected(state) {
      return state.connected;
    },
  },
  mutations: {
    setConnected(state, connected) {
      state.connected = connected;
    },
  },
  actions: {
    setConnected({ commit }, connected) {
      commit("setConnected", connected);
    },
  },
};
