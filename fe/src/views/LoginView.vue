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
const activeField = ref('tarjeta') // Puede ser 'tarjeta' o 'pin'
const loading = ref(false)

const handleKeypadPress = (key) => {
  if (key === 'Limpiar') {
    if (activeField.value === 'tarjeta') tarjeta.value = ''
    if (activeField.value === 'pin') pin.value = ''
    return
  }

  if (key === 'Borrar') {
    if (activeField.value === 'tarjeta') {
      tarjeta.value = tarjeta.value.slice(0, -1)
    } else {
      pin.value = pin.value.slice(0, -1)
    }
    return
  }

  // Ingresar números
  if (activeField.value === 'tarjeta' && tarjeta.value.length < 16) {
    tarjeta.value += key
  } else if (activeField.value === 'pin' && pin.value.length < 4) {
    pin.value += key
  }
}

const login = async () => {
  if (tarjeta.value.length !== 16 || pin.value.length !== 4) {
    errorMessage.value = 'Ingrese los 16 dígitos de la tarjeta y los 4 dígitos del PIN.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await api.post('/auth/login', {
      tarjeta: tarjeta.value,
      pin: pin.value
    })

    // Éxito:
    const data = response.data
    authStore.setToken(data.token)
    authStore.setIdCuenta(data.idCuenta)
    
    // Navegar al dashboard
    router.push('/dashboard')

  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = 'Error de conexión con el servidor.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-view">
    <div class="atm-screen">
      <h1>Cajero Automático Virtual</h1>
      
      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="login" class="login-form">
        <div class="input-group" :class="{ active: activeField === 'tarjeta' }" @click="activeField = 'tarjeta'">
          <label for="tarjeta">Número de Tarjeta (16 dígitos)</label>
          <input 
            id="tarjeta"
            type="text" 
            v-model="tarjeta" 
            maxlength="16" 
            readonly
            placeholder="0000 0000 0000 0000"
          />
        </div>

        <div class="input-group" :class="{ active: activeField === 'pin' }" @click="activeField = 'pin'">
          <label for="pin">PIN de Seguridad (4 dígitos)</label>
          <input 
            id="pin"
            type="password" 
            v-model="pin" 
            maxlength="4" 
            readonly
            placeholder="****"
          />
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Procesando...' : 'Ingresar' }}
        </button>
      </form>
    </div>

    <!-- Teclado en pantalla (Simulando hardware ATM) -->
    <div class="hardware-panel">
      <NumericKeypad @press="handleKeypadPress" />
    </div>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
}

.atm-screen {
  background-color: #ecf0f1;
  color: #2c3e50;
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  padding: 30px 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  margin-bottom: 30px;
  border: 8px solid #34495e;
}

h1 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #0352ba;
}

.error-banner {
  background-color: #ffcdd2;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: bold;
}

.input-group {
  margin-bottom: 15px;
  background: white;
  padding: 10px;
  border-radius: 6px;
  border: 2px solid transparent;
  cursor: pointer;
}

.input-group.active {
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}

.input-group label {
  display: block;
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  border: none;
  font-size: 1.4rem;
  color: #2c3e50;
  outline: none;
  background: transparent;
  letter-spacing: 2px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2ecc71;
}

.submit-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.hardware-panel {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #34495e;
  border-radius: 10px;
}
</style>
