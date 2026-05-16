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
    class="flex items-center gap-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-full px-4 md:px-5 py-2 md:py-2.5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-primary-light/20"
  >
    <!-- Icono de moneda/billete -->
    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    
    <!-- Texto principal -->
    <span class="text-xs md:text-sm font-medium tracking-wide">
      Forma de pago
    </span>
    
    <!-- Divisor vertical -->
    <span class="w-px h-5 bg-white/30"></span>
    
    <!-- USD - resaltado si está activo -->
    <div class="flex items-center gap-1">
      <span 
        class="text-sm md:text-base font-bold transition-all"
        :class="isUSD ? 'text-white drop-shadow-md' : 'text-white/60'"
      >
        USD
      </span>
      <span 
        class="text-xs transition-all"
        :class="isUSD ? 'text-white/90' : 'text-white/40'"
      >
        $
      </span>
    </div>
    
    <!-- Separador de cambio -->
    <svg class="w-3 h-3 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
    
    <!-- Bs - resaltado si está activo -->
    <div class="flex items-center gap-1">
      <span 
        class="text-sm md:text-base font-bold transition-all"
        :class="isBS ? 'text-white drop-shadow-md' : 'text-white/60'"
      >
        Bs
      </span>
      <span 
        class="text-xs transition-all"
        :class="isBS ? 'text-white/90' : 'text-white/40'"
      >
        S
      </span>
    </div>
  </button>
</template>