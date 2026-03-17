<script setup>
const emit = defineEmits(['press'])

const keys = ['1','2','3','4','5','6','7','8','9','Borrar','0','Limpiar']

const handleKeyClick = (key) => emit('press', key)
</script>

<template>
  <div class="numeric-keypad">
    <button
      v-for="key in keys"
      :key="key"
      class="keypad-btn"
      :class="{ 'btn-action': key === 'Borrar' || key === 'Limpiar' }"
      @click="handleKeyClick(key)"
    >
      {{ key === 'Borrar' ? '⌫' : key === 'Limpiar' ? 'C' : key }}
    </button>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap');

.numeric-keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
}

.keypad-btn {
  padding: 16px;
  font-size: 1.3rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  border: 1px solid #c0c8d0;
  border-bottom: 3px solid #a0aab4;
  border-radius: 6px;
  background: white;
  color: #1a3a5c;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  user-select: none;
}

.keypad-btn:hover { background: #f0f5ff; border-color: #1a3a5c; }

.keypad-btn:active {
  transform: translateY(2px);
  border-bottom-width: 1px;
  box-shadow: none;
}

.btn-action {
  background: #f5f5f5;
  color: #c62828;
  border-color: #ddd;
  border-bottom-color: #bbb;
  font-size: 1rem;
}

.btn-action:hover { background: #fff3f3; border-color: #e57373; }
</style>
