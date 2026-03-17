<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'
import NumericKeypad from '../components/NumericKeypad.vue'

const router = useRouter()
const authStore = useAuthStore()

const tarjeta = ref('')
const pin = ref('')
const errorMessage = ref('')
const activeField = ref('tarjeta')
const loading = ref(false)

const handleKeypadPress = (key) => {
  if (key === 'Limpiar') {
    if (activeField.value === 'tarjeta') tarjeta.value = ''
    else pin.value = ''
    return
  }
  if (key === 'Borrar') {
    if (activeField.value === 'tarjeta') tarjeta.value = tarjeta.value.slice(0, -1)
    else pin.value = pin.value.slice(0, -1)
    return
  }
  if (activeField.value === 'tarjeta' && tarjeta.value.length < 8) {
    tarjeta.value += key
    if (tarjeta.value.length === 8) activeField.value = 'pin'
  } else if (activeField.value === 'pin' && pin.value.length < 4) {
    pin.value += key
  }
}

const login = async () => {
  if (tarjeta.value.length !== 8 || pin.value.length !== 4) {
    errorMessage.value = 'Ingrese los 8 dígitos de la tarjeta y los 4 dígitos del PIN.'
    return
  }
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await api.post('/auth/login', { tarjeta: tarjeta.value, pin: pin.value })
    authStore.setToken(response.data.token)
    authStore.setIdCuenta(response.data.idCuenta)
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Error de conexión con el servidor.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page">
    <!-- Header del banco -->
    <header class="bank-header">
      <div class="bank-name">BancoCUC</div>
      <div class="atm-label">CAJERO AUTOMÁTICO</div>
    </header>

    <div class="atm-container">
      <!-- Pantalla -->
      <div class="atm-screen">
        <h2 class="screen-title">Bienvenido</h2>
        <p class="screen-subtitle">Inserte sus datos para continuar</p>

        <div v-if="errorMessage" class="error-box">
          {{ errorMessage }}
        </div>

        <div class="fields-area">
          <div class="field-item" :class="{ active: activeField === 'tarjeta' }" @click="activeField = 'tarjeta'">
            <label>Número de Tarjeta</label>
            <div class="field-value">
              {{ tarjeta || '_ _ _ _ _ _ _ _' }}
            </div>
          </div>

          <div class="field-item" :class="{ active: activeField === 'pin' }" @click="activeField = 'pin'">
            <label>PIN</label>
            <div class="field-value">
              {{ pin.length ? '●'.repeat(pin.length) + '_'.repeat(4 - pin.length) : '_ _ _ _' }}
            </div>
          </div>
        </div>

        <button class="confirm-btn" @click="login" :disabled="loading">
          {{ loading ? 'Verificando...' : 'Ingresar' }}
        </button>
      </div>

      <!-- Teclado físico -->
      <div class="keypad-panel">
        <NumericKeypad @press="handleKeypadPress" />
      </div>
    </div>

    <footer class="atm-footer">
      BancoCUC
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }

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

/* Header */
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

.bank-name { font-size: 1.1rem; font-weight: 700; letter-spacing: 0.5px; }
.atm-label { font-size: 0.7rem; letter-spacing: 2px; opacity: 0.7; }

/* Contenedor principal */
.atm-container {
  width: 100%;
  max-width: 580px;
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-top: none;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Pantalla */
.atm-screen {
  background: white;
  border-bottom: 3px solid #1a3a5c;
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.screen-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a3a5c;
  margin: 0;
}

.screen-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin: -0.6rem 0 0;
}

.error-box {
  background: #fff3f3;
  border: 1px solid #e57373;
  border-left: 4px solid #d32f2f;
  color: #b71c1c;
  padding: 0.65rem 0.9rem;
  border-radius: 4px;
  font-size: 0.88rem;
  font-weight: 500;
}

.fields-area {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.field-item {
  background: #f9f9f9;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.field-item.active {
  border-color: #1a3a5c;
  background: #f0f5ff;
  box-shadow: 0 0 0 3px rgba(26,58,92,0.1);
}

.field-item label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.3rem;
}

.field-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  letter-spacing: 3px;
  font-variant-numeric: tabular-nums;
}

.confirm-btn {
  background: #1a3a5c;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.9rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-btn:hover:not(:disabled) { background: #0f2540; }
.confirm-btn:disabled { background: #aaa; cursor: not-allowed; }

/* Teclado */
.keypad-panel {
  background: #e0e4e8;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #ccc;
}

/* Footer */
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
