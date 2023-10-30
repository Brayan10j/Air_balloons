import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({ count: 1000, name: "Eduardo" }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});
