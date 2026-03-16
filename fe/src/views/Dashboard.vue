<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">Cajero Automático</h1>
    <div class="actions-grid">
      <button class="atm-button atm-retirar" @click="handleAction('retirar')">
        <span class="label">Retirar</span>
      </button>

      <button class="atm-button atm-depositar" @click="handleAction('depositar')">
        <span class="label">Depositar</span>
      </button>

      <button class="atm-button atm-movimientos" @click="handleAction('movimientos')">
        <span class="label">Ver Movimientos</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleAction = (action) => {
  console.log('Acción seleccionada:', action)
  // Dependiendo del flujo futuro, aquí se redirigiría
  // router.push(`/${action}`) 
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #121212; /* Tema oscuro, alto contraste */
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.dashboard-title {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #e0e0e0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
}

.atm-button {
  background-color: #1e1e1e;
  border: 4px solid #333;
  border-radius: 12px;
  padding: 3rem 2rem;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.atm-button:hover, .atm-button:focus {
  transform: translateY(-5px);
  border-color: #00bcd4; /* Azul cyan para alto contraste en focus/hover */
  background-color: #2a2a2a;
  box-shadow: 0 12px 24px rgba(0, 188, 212, 0.3);
  outline: none;
}

.atm-button:active {
  transform: translateY(2px);
  box-shadow: 0 4px 8px rgba(0, 188, 212, 0.2);
}

.atm-button .label {
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
