<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useMonedaStore } from '../../store/moneda';

const monedaStore = useMonedaStore();
const monedaActual = ref('usd');

const toggleMoneda = () => {
  monedaStore.toggleMoneda();
  monedaActual.value = monedaStore.getMonedaActual();
};

const actualizarMoneda = () => {
  monedaActual.value = monedaStore.getMonedaActual();
};

// Computed para saber qué moneda está activa
const isUSD = computed(() => monedaActual.value === 'usd');
const isBS = computed(() => monedaActual.value === 'bs');

onMounted(() => {
  monedaActual.value = monedaStore.getMonedaActual();
  window.addEventListener('moneda-cambiada', actualizarMoneda);
});

onUnmounted(() => {
  window.removeEventListener('moneda-cambiada', actualizarMoneda);
});
</script>

<template>
  <button 
    @click="toggleMoneda"
    class="flex items-center gap-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-full px-4 md:px-5 py-2 md:py-2.5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
    
    <span class="text-xs md:text-sm">Pagar en:</span>
    
    <!-- USD badge -->
    <div 
      class="flex items-center gap-1 px-2 py-0.5 rounded-full transition-all"
      :class="isUSD ? 'bg-white/30 shadow-sm' : 'bg-white/10'"
    >
      <span class="text-sm font-bold">USD</span>
      <span class="text-xs">$</span>
    </div>
    
    <svg class="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
    
    <!-- Bs badge -->
    <div 
      class="flex items-center gap-1 px-2 py-0.5 rounded-full transition-all"
      :class="isBS ? 'bg-white/30 shadow-sm' : 'bg-white/10'"
    >
      <span class="text-sm font-bold">Bs</span>
      <span class="text-xs">S</span>
    </div>
  </button>
</template>