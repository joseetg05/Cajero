<template>
  <div class="formulario-transaccion">
    
    <!-- Bloque de Errores (Task 4.1) -->
    <div v-if="errorMsg" class="error-msg">
      {{ errorMsg }}
    </div>
    
    <div class="input-group">
      <label for="monto">Monto de la transacción</label>
      <!-- Task 3.1 & 4.2 -->
      <input 
        id="monto" 
        type="number" 
        class="monto-input" 
        v-model.number="monto"
        :disabled="isLoading"
        placeholder="0.00"
        min="0"
      />
    </div>

    <!-- Botones predefinidos (Task 1.2, 2.3 & 4.2) -->
    <div class="quick-amounts">
      <button class="amount-btn" :disabled="isLoading" @click="setMonto(2000)">$2,000</button>
      <button class="amount-btn" :disabled="isLoading" @click="setMonto(5000)">$5,000</button>
      <button class="amount-btn" :disabled="isLoading" @click="setMonto(10000)">$10,000</button>
      <button class="amount-btn" :disabled="isLoading" @click="setMonto(20000)">$20,000</button>
    </div>

    <!-- Task 3.1, 3.2, 3.3 & 4.2 -->
    <button 
      class="submit-btn" 
      type="button" 
      :disabled="monto <= 0 || isLoading"
      @click="handleSubmit"
    >
      <span v-if="isLoading" class="spinner"></span>
      <span v-else>{{ botonTexto }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Task 2.1 & 3.3 prop para la accion
const props = defineProps({
  tipo: {
    type: String,
    required: true,
    validator: (value) => ['retiro', 'deposito'].includes(value)
  },
  action: {
    type: Function,
    required: true
  }
})

// Task 2.2: Refs
const monto = ref()
const isLoading = ref(false)
const errorMsg = ref('')

// Task 3.2: Texto dinámico
const botonTexto = computed(() => {
  return props.tipo === 'retiro' ? 'Retirar' : 'Depositar'
})

// Task 2.3: Función de botones quick
const setMonto = (cantidad) => {
  monto.value = cantidad
}

// Task 3.3 & 4.2: Manejo del submit
const handleSubmit = async () => {
  if (monto.value <= 0) return
  
  errorMsg.value = ''
  isLoading.value = true
  
  try {
    // LLamamos la función inyectada (padre) esperando una Promesa
    await props.action(monto.value)
    // Si la transaccion fue exitosa limpiamos el campo
    monto.value = 0
  } catch (err) {
    errorMsg.value = err.response?.data?.message || err.message || 'Error procesando la transacción.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.formulario-transaccion {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #1e1e1e;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  color: #fff;
}

.error-msg {
  background-color: rgba(255, 82, 82, 0.1);
  color: #ff5252;
  padding: 1rem;
  border: 1px solid #ff5252;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 1rem;
  color: #a0a0a0;
}

.monto-input {
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1.5rem;
  color: #fff;
  text-align: right;
  transition: border-color 0.3s ease;
}

.monto-input:focus {
  outline: none;
  border-color: #00bcd4;
}

/* Ocultar flechas del input number */
.monto-input::-webkit-outer-spin-button,
.monto-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.monto-input[type=number] {
  -moz-appearance: textfield;
}

.quick-amounts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.amount-btn {
  background-color: #333;
  color: #00bcd4;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.amount-btn:hover:not(:disabled) {
  background-color: #444;
  border-color: #00bcd4;
}

.submit-btn {
  background-color: #00bcd4;
  color: #121212;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  text-transform: uppercase;
  margin-top: 1rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 52px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0097a7;
}

.submit-btn:disabled {
  background-color: #555;
  color: #888;
  cursor: not-allowed;
}

.amount-btn:disabled, .monto-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Spinner animado */
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(18, 18, 18, 0.3);
  border-radius: 50%;
  border-top-color: #121212;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
