import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    idCuenta: null
  }),
  actions: {
    setToken(newToken) {
      this.token = newToken
    },
    setIdCuenta(newIdCuenta) {
      this.idCuenta = newIdCuenta
    },
    logout() {
      this.token = null
      this.idCuenta = null
    }
  }
})
