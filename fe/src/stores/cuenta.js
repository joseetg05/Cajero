import { defineStore } from 'pinia'
import api from '../services/api'

export const useCuentaStore = defineStore('cuenta', {
  state: () => ({
    saldo: 0,
    moneda: '',
    titular: '',
    numeroCuenta: '',
    // Datos adicionales del cliente (de sp_ConsultarInfoCliente)
    cedula: '',
    correo: '',
    vencimientoTarjeta: '',
    estadoTarjeta: '',
    loading: false,
    error: null
  }),
  actions: {
    // Consulta saldo (ligero, se usa al volver de transacciones)
    async fetchBalance() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/atm/balance')
        this.saldo = response.data.saldo
        this.moneda = response.data.moneda
        this.titular = response.data.titular
        this.numeroCuenta = response.data.numeroCuenta
      } catch (err) {
        this.error = 'Error al obtener el saldo'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    // Consulta completa del cliente via sp_ConsultarInfoCliente (Dashboard)
    async fetchClientInfo() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/atm/client-info')
        const d = response.data
        this.titular = d.titular
        this.numeroCuenta = d.iban
        this.moneda = d.moneda
        this.saldo = d.saldo
        this.cedula = d.cedula
        this.correo = d.correo
        this.vencimientoTarjeta = d.vencimientoTarjeta
        this.estadoTarjeta = d.estadoTarjeta
      } catch (err) {
        this.error = 'Error al obtener información del cliente'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    setSaldo(nuevoSaldo) {
      this.saldo = nuevoSaldo
    }
  }
})
