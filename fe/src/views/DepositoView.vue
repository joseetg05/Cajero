<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCuentaStore } from '../stores/cuenta'
import FormularioTransaccion from '../components/FormularioTransaccion.vue'
import api from '../services/api'

const router = useRouter()
const cuentaStore = useCuentaStore()
const successMsg = ref('')
const showModal = ref(false)

const handleDeposito = async (monto) => {
  try {
    await api.post('/atm/deposit', { monto })
    successMsg.value = `Depósito de ${cuentaStore.moneda} ${monto.toLocaleString('es-MX')} procesado con éxito.`
    await cuentaStore.fetchBalance()
    showModal.value = true
  } catch (err) { throw err }
}

const otroDeposito = () => { showModal.value = false; successMsg.value = '' }
const volverDashboard = () => router.push('/dashboard')
</script>

<template>
  <div class="page">
    <header class="bank-header">
      <button class="back-btn" @click="router.push('/dashboard')">← Volver</button>
      <div class="bank-name">BancoCUC</div>
      <div class="balance-pill">
        <span>{{ cuentaStore.moneda }} {{ cuentaStore.saldo.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</span>
      </div>
    </header>

    <div class="atm-container">
      <div class="atm-screen">
        <h2 class="screen-title">Depósito de Efectivo</h2>
        <FormularioTransaccion tipo="deposito" :action="handleDeposito" />
      </div>
    </div>

    <footer class="atm-footer">BancoCUC</footer>

    <b-modal
      v-model="showModal"
      title="Transacción Exitosa"
      hide-header-close no-close-on-backdrop no-close-on-esc centered
      ok-title="Volver al Dashboard" cancel-title="Hacer otro depósito"
      ok-variant="primary" cancel-variant="outline-secondary"
      @ok="volverDashboard" @cancel="otroDeposito"
    >
      <div class="modal-body-custom">
        <div class="success-check">✓</div>
        <p class="modal-msg">{{ successMsg }}</p>
        <p class="modal-sub">¿Qué deseas hacer a continuación?</p>
      </div>
    </b-modal>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.page {
  min-height: 100vh;
  background: #e8ecf0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  font-family: 'Inter', sans-serif;
}

.bank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 580px;
  background: #1a3a5c;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 12px 12px 0 0;
}

.back-btn {
  background: transparent;
  color: rgba(255,255,255,0.75);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 6px;
  padding: 0.3rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s;
}
.back-btn:hover { background: rgba(255,255,255,0.1); color: white; }

.bank-name { font-size: 1rem; font-weight: 700; }

.balance-pill { font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.9); }

.atm-container {
  width: 100%;
  max-width: 580px;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
}

.atm-screen { padding: 1.75rem 2rem; }

.screen-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a3a5c;
  margin: 0 0 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.atm-footer {
  width: 100%;
  max-width: 580px;
  background: #1a3a5c;
  color: rgba(255,255,255,0.45);
  text-align: center;
  font-size: 0.65rem;
  padding: 0.6rem;
  border-radius: 0 0 12px 12px;
}

.modal-body-custom {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  text-align: center;
  gap: 0.5rem;
}

.success-check {
  width: 52px; height: 52px;
  background: #2e7d32;
  color: white;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.modal-msg { font-size: 1rem; font-weight: 600; color: #222; margin: 0; }
.modal-sub { font-size: 0.85rem; color: #777; margin: 0; }
</style>
