<script setup lang="ts">
import { useCurrencyStore } from '../stores/currencyStore'
import { pinia } from '../plugins/pinia'

const currencyStore = useCurrencyStore(pinia)
</script>

<template>
  <button
    @click="currencyStore.toggleCurrency()"
    class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer"
    :class="currencyStore.currency === 'USD' 
      ? 'bg-cream-100 text-brown-700 hover:bg-cream-200' 
      : 'bg-brown-600 text-cream-100 hover:bg-brown-500'"
  >
    <span class="text-sm">💵</span>
    <span>{{ currencyStore.currency === 'USD' ? 'USD' : 'BS' }}</span>
    <span class="text-[10px] opacity-60">▼</span>
  </button>
</template>