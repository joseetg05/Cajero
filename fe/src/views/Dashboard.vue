<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCuentaStore } from '../stores/cuenta'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const cuentaStore = useCuentaStore()
const authStore = useAuthStore()

const handleLogout = () => { authStore.logout(); router.push('/login') }

onMounted(() => { cuentaStore.fetchClientInfo() })
</script>

<template>
  <div class="page">
    <header class="bank-header">
      <div class="bank-name">BancoCUC</div>
      <button class="logout-btn" @click="handleLogout">Salir</button>
    </header>

    <div class="atm-container">
      <!-- Pantalla principal -->
      <div class="atm-screen">
        <div class="account-block" v-if="cuentaStore.titular">
          <div class="account-row">
            <span class="account-label">Titular</span>
            <span class="account-value">{{ cuentaStore.titular }}</span>
          </div>
          <div class="account-row" v-if="cuentaStore.numeroCuenta">
            <span class="account-label">IBAN</span>
            <span class="account-value iban">{{ cuentaStore.numeroCuenta }}</span>
          </div>
        </div>

        <div class="balance-block">
          <span class="balance-label">Saldo Disponible</span>
          <span class="balance-amount">
            {{ cuentaStore.moneda }} {{ cuentaStore.saldo.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}
          </span>
        </div>

        <div class="divider"></div>

        <p class="menu-prompt">Seleccione una operación:</p>
        <div class="menu-grid">
          <button class="menu-btn" @click="router.push('/retiro')">
            Retirar
          </button>
          <button class="menu-btn" @click="router.push('/deposito')">
            Depositar
          </button>
          <button class="menu-btn" @click="router.push('/movimientos')">
            Movimientos
          </button>
        </div>
      </div>
    </div>

    <footer class="atm-footer">
      BancoCUC
    </footer>
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
  padding: 0.85rem 1.5rem;
  border-radius: 12px 12px 0 0;
}

.bank-name { font-size: 1.1rem; font-weight: 700; }

.logout-btn {
  background: transparent;
  color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 6px;
  padding: 0.35rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}

.logout-btn:hover {
  background: rgba(255,255,255,0.1);
  color: white;
  border-color: rgba(255,255,255,0.6);
}

.atm-container {
  width: 100%;
  max-width: 580px;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
}

.atm-screen {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.account-block {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.account-row {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.account-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.account-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1a3a5c;
}

.iban {
  font-family: 'Courier New', monospace;
  font-size: 0.88rem;
  color: #555;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.balance-block {
  background: #f0f5ff;
  border: 1px solid #c5d8f0;
  border-left: 4px solid #1a3a5c;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.balance-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #1a3a5c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.balance-amount {
  font-size: 2rem;
  font-weight: 700;
  color: #1a3a5c;
  font-variant-numeric: tabular-nums;
}

.divider {
  height: 1px;
  background: #e0e0e0;
}

.menu-prompt {
  color: #555;
  font-size: 0.9rem;
  margin: 0;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.menu-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 0.5rem;
  background: #f8f9fa;
  border: 2px solid #dde2e8;
  border-radius: 10px;
  color: #1a3a5c;
  font-size: 0.88rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-btn:hover {
  background: #f0f5ff;
  border-color: #1a3a5c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26,58,92,0.12);
}

.menu-icon { font-size: 1.6rem; }

.atm-footer {
  width: 100%;
  max-width: 580px;
  background: #1a3a5c;
  color: rgba(255,255,255,0.5);
  text-align: center;
  font-size: 0.65rem;
  letter-spacing: 0.5px;
  padding: 0.6rem;
  border-radius: 0 0 12px 12px;
}
</style>
