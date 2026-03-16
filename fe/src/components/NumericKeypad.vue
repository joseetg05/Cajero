<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['press'])

const keys = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  'Borrar', '0', 'Limpiar'
]

const handleKeyClick = (key) => {
  emit('press', key)
}
</script>

<template>
  <div class="numeric-keypad">
    <button
      v-for="key in keys"
      :key="key"
      class="keypad-btn"
      :class="{ 'action-btn': key === 'Borrar' || key === 'Limpiar' }"
      @click="handleKeyClick(key)"
    >
      {{ key }}
    </button>
  </div>
</template>

<style scoped>
.numeric-keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-width: 300px;
  margin: 0 auto;
}

.keypad-btn {
  padding: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  background-color: #f0f0f0;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.keypad-btn:active {
  transform: translateY(2px);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.keypad-btn:hover {
  background-color: #e0e0e0;
}

.action-btn {
  background-color: #ffebee;
  color: #d32f2f;
  font-size: 1.2rem;
}

.action-btn:hover {
  background-color: #ffcdd2;
}
</style>
