import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Al iniciar, intenta leer desde localStorage para sobrevivir el F5
    token: localStorage.getItem('atm_token') || null,
    idCuenta: localStorage.getItem('atm_idCuenta') || null
  }),
  actions: {
    setToken(newToken) {
      this.token = newToken
      if (newToken) localStorage.setItem('atm_token', newToken)
      else localStorage.removeItem('atm_token')
    },
    setIdCuenta(newIdCuenta) {
      this.idCuenta = newIdCuenta
      if (newIdCuenta) localStorage.setItem('atm_idCuenta', newIdCuenta)
      else localStorage.removeItem('atm_idCuenta')
    },
    logout() {
      this.token = null
      this.idCuenta = null
      localStorage.removeItem('atm_token')
      localStorage.removeItem('atm_idCuenta')
    }
  }
})
