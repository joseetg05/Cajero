<script setup>
import { ref, computed } from 'vue'
import { useCuentaStore } from '../stores/cuenta'
import NumericKeypad from './NumericKeypad.vue'

const props = defineProps({
  tipo: { type: String, required: true, validator: (v) => ['retiro', 'deposito'].includes(v) },
  action: { type: Function, required: true }
})

const cuentaStore = useCuentaStore()
const monto = ref(0)
const isLoading = ref(false)
const errorMsg = ref('')

const botonTexto = computed(() => props.tipo === 'retiro' ? 'Confirmar Retiro' : 'Confirmar Depósito')

const displayMonto = computed(() => {
  if (!monto.value) return `${cuentaStore.moneda} 0`
  return `${cuentaStore.moneda} ${monto.value.toLocaleString('es-MX')}`
})

const setMonto = (cantidad) => { monto.value = cantidad; errorMsg.value = '' }

const handleKeypadPress = (key) => {
  let current = (monto.value || 0).toString()
  if (key === 'Limpiar') { monto.value = 0; return }
  if (key === 'Borrar') {
    monto.value = current.length <= 1 ? 0 : parseInt(current.slice(0, -1))
    return
  }
  if (current.length < 9) {
    monto.value = monto.value === 0 ? parseInt(key) : parseInt(current + key)
  }
}

const handleSubmit = async () => {
  if (!monto.value || monto.value <= 0) return
  errorMsg.value = ''
  isLoading.value = true
  try {
    await props.action(monto.value)
    monto.value = 0
  } catch (err) {
    errorMsg.value = err.response?.data?.error || err.message || 'Error procesando la transacción.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="form-area">
    <!-- Display del monto -->
    <div class="amount-section">
      <label class="section-label">Monto a {{ tipo === 'retiro' ? 'retirar' : 'depositar' }}</label>
      <div class="amount-display" :class="{ 'has-value': monto > 0 }">
        {{ displayMonto }}
      </div>
    </div>

    <div v-if="errorMsg" class="error-box">
      {{ errorMsg }}
    </div>

    <!-- Accesos rápidos -->
    <div class="quick-section">
      <span class="section-label">Montos rápidos</span>
      <div class="quick-grid">
        <button v-for="q in [2000, 5000, 10000, 20000]" :key="q"
          class="quick-btn" :disabled="isLoading" @click="setMonto(q)">
          {{ cuentaStore.moneda }} {{ q.toLocaleString() }}
        </button>
      </div>
    </div>

    <!-- Teclado + confirmar -->
    <div class="input-area">
      <NumericKeypad @press="handleKeypadPress" />
      <button class="confirm-btn" :disabled="!monto || monto <= 0 || isLoading" @click="handleSubmit">
        <span v-if="isLoading" class="spinner"></span>
        <span v-else>{{ botonTexto }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.form-area {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-family: 'Inter', sans-serif;
}

.section-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.4rem;
}

.amount-section { display: flex; flex-direction: column; }

.amount-display {
  font-size: 2rem;
  font-weight: 700;
  color: #999;
  background: #f9f9f9;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  text-align: right;
  transition: all 0.2s;
  font-variant-numeric: tabular-nums;
}

.amount-display.has-value {
  color: #1a3a5c;
  border-color: #1a3a5c;
  background: #f0f5ff;
}

.error-box {
  background: #fff3f3;
  border: 1px solid #e57373;
  border-left: 4px solid #d32f2f;
  color: #b71c1c;
  padding: 0.65rem 0.9rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.quick-section { display: flex; flex-direction: column; }

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.quick-btn {
  padding: 0.6rem 0.25rem;
  background: white;
  border: 1px solid #dde2e8;
  border-radius: 6px;
  color: #1a3a5c;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
}

.quick-btn:hover:not(:disabled) {
  background: #f0f5ff;
  border-color: #1a3a5c;
}

.quick-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.input-area {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.confirm-btn {
  width: 100%;
  padding: 0.9rem;
  background: #1a3a5c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
}

.confirm-btn:hover:not(:disabled) { background: #0f2540; }
.confirm-btn:disabled { background: #aaa; cursor: not-allowed; }

.spinner {
  width: 20px; height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
