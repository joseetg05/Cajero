<template>
  <div class="movimientos-container">
    <h1 class="movimientos-title">Historial de Movimientos</h1>
    
    <div class="table-wrapper">
      <div v-if="loading" class="loading-state">
        Cargando movimientos...
      </div>
      
      <div v-else-if="error" class="error-state">
        {{ error }}
      </div>

      <table v-else class="movimientos-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mov in movimientos" :key="mov.ID_MOVIMIENTO">
            <td>{{ formatDate(mov.FECHA_HORA) }}</td>
            <td :class="getTypeClass(mov.Tipo)">{{ formatType(mov.Tipo) }}</td>
            <td :class="getTypeClass(mov.Tipo)">${{ mov.MONTO.toFixed(2) }}</td>
          </tr>
          
          <tr v-if="movimientos.length === 0">
            <td colspan="3" class="empty-state">No hay movimientos registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <button class="back-button" @click="handleBack">Volver al Dashboard</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const movimientos = ref([])
const loading = ref(true)
const error = ref(null)

const handleBack = () => {
  router.push('/dashboard')
}

const fetchMovimientos = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/atm/transactions')
    movimientos.value = response.data || []
  } catch (err) {
    error.value = 'No se pudo cargar el historial.'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-MX', { 
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).format(date)
}

const formatType = (tipo) => {
  if (!tipo) return 'Desconocido'
  const t = tipo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
  return t === 'DEPOSITO' ? 'Depósito' : 
         t === 'RETIRO' ? 'Retiro' : tipo
}

const getTypeClass = (tipo) => {
  if (!tipo) return ''
  const t = tipo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
  if (t === 'DEPOSITO') return 'text-deposit'
  if (t === 'RETIRO') return 'text-withdrawal'
  return ''
}

onMounted(() => {
  fetchMovimientos()
})
</script>

<style scoped>
.movimientos-container {
  min-height: 100vh;
  background-color: #121212;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.movimientos-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #e0e0e0;
}

.table-wrapper {
  width: 100%;
  max-width: 800px;
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  margin-bottom: 2rem;
}

.back-button {
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #555;
}

/* Estilos de Tabla */
.movimientos-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.movimientos-table th, .movimientos-table td {
  padding: 1rem;
  border-bottom: 1px solid #333;
}

.movimientos-table th {
  background-color: #2c2c2c;
  color: #00bcd4;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.movimientos-table tbody tr:hover {
  background-color: #2a2a2a;
}

/* Estados */
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error-state {
  color: #ff5252;
}

/* Clases Condicionales para Monto (Sin Emojis) */
.text-deposit {
  color: #4caf50; /* Verde para depósitos */
  font-weight: 600;
}

.text-withdrawal {
  color: #ff5252; /* Rojo para retiros */
  font-weight: 600;
}
</style>
