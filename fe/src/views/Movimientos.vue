<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useCuentaStore } from '../stores/cuenta'

const router = useRouter()
const cuentaStore = useCuentaStore()
const movimientos = ref([])
const resumen = ref([])
const loading = ref(true)
const error = ref(null)

const fetchMovimientos = async () => {
  loading.value = true; error.value = null
  try {
    const response = await api.get('/atm/transactions')
    movimientos.value = response.data.movimientos || []
    resumen.value     = response.data.resumen     || []
  } catch (err) {
    error.value = 'No se pudo cargar el historial.'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const localStr = dateString.replace('Z', '')
  return new Intl.DateTimeFormat('es-CR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(localStr))
}

const formatType = (tipo) => tipo || '-'

const getTypeClass = (tipo) => {
  if (!tipo) return ''
  const t = tipo.toUpperCase()
  return t.includes('DEP') ? 'type-deposit' : t.includes('RET') ? 'type-withdrawal' : ''
}

const getEstadoClass = (estado) => {
  if (!estado) return ''
  return estado.toLowerCase() === 'exitoso' ? 'estado-ok' : 'estado-fail'
}

onMounted(() => {
  fetchMovimientos()
  if (!cuentaStore.moneda) cuentaStore.fetchBalance()
})
</script>

<template>
  <div class="page">
    <header class="bank-header">
      <button class="back-btn" @click="router.push('/dashboard')">← Volver</button>
      <div class="bank-name">BancoCUC</div>
      <div class="header-spacer"></div>
    </header>

    <div class="atm-container">
      <div class="atm-screen">
        <h2 class="screen-title">Historial de Movimientos</h2>

        <div v-if="loading" class="state-msg">Cargando movimientos...</div>
        <div v-else-if="error" class="state-msg error">{{ error }}</div>
        <template v-else>

          <div v-if="resumen.length > 0" class="resumen-section">
            <h3 class="resumen-title">Resumen por tipo</h3>
            <div class="resumen-grid">
              <div v-for="r in resumen" :key="r.TipoMovimiento + r.Estado" class="resumen-card" :class="getTypeClass(r.TipoMovimiento)">
                <div class="resumen-header">
                  <span class="resumen-tipo">{{ r.TipoMovimiento }}</span>
                  <span class="resumen-estado-badge" :class="getEstadoClass(r.Estado)">{{ r.Estado }}</span>
                </div>
                <div class="resumen-stats">
                  <div class="stat"><span class="stat-label">Operaciones</span><span class="stat-value">{{ r.CantidadOperaciones }}</span></div>
                  <div class="stat"><span class="stat-label">Total</span><span class="stat-value">{{ cuentaStore.moneda }} {{ parseFloat(r.MontoTotal).toLocaleString('es-CR', { minimumFractionDigits: 2 }) }}</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabla detalle -->
          <table class="mov-table">
            <thead>
              <tr>
                <th>Fecha (CR)</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Motivo</th>
                <th class="text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="movimientos.length === 0">
                <td colspan="5" class="empty-row">No hay movimientos registrados.</td>
              </tr>
              <tr v-for="mov in movimientos" :key="mov.ID_MOVIMIENTO">
                <td class="date-cell">{{ formatDate(mov.FECHA_HORA) }}</td>
                <td>
                  <span class="tipo-badge" :class="getTypeClass(mov.Tipo)">{{ formatType(mov.Tipo) }}</span>
                </td>
                <td>
                  <span class="estado-badge" :class="getEstadoClass(mov.Estado)">{{ mov.Estado || '-' }}</span>
                </td>
                <td class="motivo-cell">{{ mov.MOTIVO || '-' }}</td>
                <td class="text-right amount-cell" :class="getTypeClass(mov.Tipo)">
                  {{ cuentaStore.moneda }} {{ parseFloat(mov.MONTO).toLocaleString('es-CR', { minimumFractionDigits: 2 }) }}
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>
    </div>

    <footer class="atm-footer">BancoCUC</footer>
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
  max-width: 680px;
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
.header-spacer { width: 80px; }

.atm-container {
  width: 100%;
  max-width: 680px;
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

/* Resumen estadístico */
.resumen-section {
  margin-bottom: 1.5rem;
}

.resumen-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 0.6rem;
}

.resumen-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.6rem;
}

.resumen-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  background: #fafafa;
}

.resumen-card.type-deposit { border-left: 3px solid #2e7d32; background: #f8fff9; }
.resumen-card.type-withdrawal { border-left: 3px solid #c62828; background: #fff8f8; }

.resumen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
}

.resumen-tipo {
  font-size: 0.85rem;
  font-weight: 700;
  color: #333;
}

.resumen-estado-badge {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.4rem;
  border-radius: 10px;
}

.resumen-stats {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
}

.stat-label { color: #888; }
.stat-value { font-weight: 600; color: #333; }

.state-msg {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 0.95rem;
}

.state-msg.error { color: #c62828; }

.mov-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.mov-table th {
  text-align: left;
  padding: 0.6rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #eee;
}

.mov-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.mov-table tr:last-child td { border-bottom: none; }
.mov-table tr:hover td { background: #f9f9f9; }

.text-right { text-align: right; }

.date-cell { color: #666; font-size: 0.83rem; }

.tipo-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
}

.type-deposit { color: #2e7d32; background: #e8f5e9; }
.type-withdrawal { color: #c62828; background: #ffebee; }

.estado-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.estado-ok { color: #2e7d32; background: #e8f5e9; }
.estado-fail { color: #c62828; background: #ffebee; }

.motivo-cell {
  color: #666;
  font-size: 0.82rem;
  max-width: 180px;
}

.amount-cell { font-weight: 600; }

.empty-row {
  text-align: center;
  color: #aaa;
  padding: 2rem;
  font-style: italic;
}

.atm-footer {
  width: 100%;
  max-width: 680px;
  background: #1a3a5c;
  color: rgba(255,255,255,0.45);
  text-align: center;
  font-size: 0.65rem;
  padding: 0.6rem;
  border-radius: 0 0 12px 12px;
}
</style>
