import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCartStore } from './cartStore'
import { pinia } from '../plugins/pinia'

export const useCurrencyStore = defineStore('currency', () => {
  const currency = ref<'USD' | 'BS'>('USD')
  const tasaCambio = ref(700)

  const simbolo = computed(() => currency.value === 'USD' ? '$' : 'Bs.')
  
  function convertirPrecio(precioUSD: number): string {
    if (currency.value === 'USD') {
      return `$${precioUSD.toFixed(2)}`
    } else {
      const precioBS = (precioUSD * tasaCambio.value).toFixed(2)
      return `Bs. ${precioBS.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
    }
  }

  function toggleCurrency() {
    currency.value = currency.value === 'USD' ? 'BS' : 'USD'
    // Sincronizar con el carrito
    try {
      const cartStore = useCartStore(pinia)
      cartStore.setCurrency(currency.value)
    } catch (e) {
      // El carrito puede no estar inicializado aún
    }
  }

  function setTasaCambio(tasa: number) {
    tasaCambio.value = tasa
  }

  return {
    currency,
    tasaCambio,
    simbolo,
    convertirPrecio,
    toggleCurrency,
    setTasaCambio
  }
})