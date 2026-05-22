<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { X, ShoppingCart, Shield, Truck, Package, Minus, Plus } from 'lucide-vue-next'
import type { Producto } from '../data/productos'
import { useCurrencyStore } from '../stores/currencyStore'
import { pinia } from '../plugins/pinia'

const props = defineProps<{ producto: Producto }>()
const emit = defineEmits(['close', 'add-to-cart'])
const currencyStore = useCurrencyStore(pinia)
const cantidad = ref(1)

function getPrecioActual(): number {
  return props.producto.enOferta && props.producto.precioOferta 
    ? props.producto.precioOferta 
    : props.producto.precio
}

function addWithQuantity() {
  for (let i = 0; i < cantidad.value; i++) {
    emit('add-to-cart')
  }
  emit('close')
}

function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 bg-black/50 flex items-end justify-center overflow-hidden md:hidden"
    @click="onBackdrop"
  >
    <div
      class="bg-cream-50 w-full max-h-[92vh] rounded-t-3xl overflow-hidden shadow-2xl flex flex-col animate-slide-up"
      @click.stop
    >
      <!-- Swipe Indicator -->
      <div class="flex justify-center pt-3 pb-1">
        <div class="w-10 h-1 bg-brown-300 rounded-full"></div>
      </div>

      <!-- Header -->
      <div class="flex justify-between items-center px-4 pb-2">
        <span class="text-[10px] text-brown-400 uppercase tracking-widest font-semibold bg-cream-100 px-2.5 py-1 rounded-full">
          {{ producto.categoria }}
        </span>
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-brown-400 font-medium bg-cream-100 px-2 py-0.5 rounded-full">
            {{ currencyStore.currency === 'USD' ? '$' : 'Bs.' }}
          </span>
          <button
            @click="emit('close')"
            class="bg-brown-100 hover:bg-brown-200 rounded-full p-1.5 transition-colors"
          >
            <X :size="16" class="text-brown-600" />
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        <!-- Imagen -->
        <div class="relative bg-cream-50 rounded-2xl overflow-hidden h-48">
          <img
            :src="producto.imagen"
            :alt="producto.nombre"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-2 left-2 flex flex-col gap-1">
            <span v-if="producto.enOferta" class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
              EN OFERTA
            </span>
          </div>
        </div>

        <h2 class="font-playfair text-base text-brown-800 font-bold leading-snug">{{ producto.nombre }}</h2>

        <!-- Precio -->
        <div class="flex items-baseline gap-2">
          <span class="text-xl font-bold" :class="producto.enOferta ? 'text-red-600' : 'text-brown-700'">
            {{ currencyStore.convertirPrecio(getPrecioActual()) }}
          </span>
          <span v-if="producto.oldPrice" class="text-sm text-brown-300 line-through">
            {{ currencyStore.convertirPrecio(producto.oldPrice) }}
          </span>
          <span v-if="producto.enOferta && producto.oldPrice" class="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{{ Math.round(((producto.oldPrice - getPrecioActual()) / producto.oldPrice) * 100) }}%
          </span>
        </div>

        <div class="bg-cream-100 rounded-xl p-3 border border-cream-200">
          <p class="text-brown-600 text-xs leading-relaxed whitespace-pre-line">{{ producto.descripcion }}</p>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="bg-white rounded-xl p-2.5 border border-brown-100">
            <p class="text-[10px] text-brown-400 uppercase tracking-wider">Intensidad</p>
            <p class="font-semibold text-brown-700 text-xs mt-0.5">{{ producto.intensidad }}</p>
          </div>
          <div class="bg-white rounded-xl p-2.5 border border-brown-100">
            <p class="text-[10px] text-brown-400 uppercase tracking-wider">Estado</p>
            <p class="font-semibold text-xs mt-0.5 capitalize" :class="producto.estadoEnvio === 'disponible' ? 'text-green-600' : 'text-red-600'">{{ producto.estadoEnvio }}</p>
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center gap-2 text-xs text-brown-600">
            <Shield :size="14" class="text-green-500 shrink-0" />
            <span>Producto 100% original</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-brown-600">
            <Truck :size="14" class="text-brown-500 shrink-0" />
            <span>Envío a toda Venezuela</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-brown-600">
            <Package :size="14" class="text-brown-500 shrink-0" />
            <span>Empaquetado seguro</span>
          </div>
        </div>

        <!-- Cantidad SIN LÍMITE -->
        <div class="flex items-center justify-between">
          <span class="text-xs text-brown-600 font-medium">Cantidad:</span>
          <div class="flex items-center gap-2 bg-white rounded-lg border border-brown-200 p-0.5">
            <button 
              @click="cantidad = Math.max(1, cantidad - 1)" 
              class="w-7 h-7 rounded-md bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-brown-700 font-bold transition-colors"
            >
              <Minus :size="12" />
            </button>
            <input 
              v-model.number="cantidad" 
              type="number" 
              min="1"
              class="w-12 text-center font-bold text-brown-800 text-sm bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button 
              @click="cantidad = cantidad + 1" 
              class="w-7 h-7 rounded-md bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-brown-700 font-bold transition-colors"
            >
              <Plus :size="12" />
            </button>
          </div>
        </div>

        <!-- Botón -->
        <button @click="addWithQuantity" class="w-full flex items-center justify-center gap-2 bg-brown-700 hover:bg-brown-600 text-cream-50 font-bold py-3 rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-lg text-sm">
          <ShoppingCart :size="18" />
          Añadir — {{ currencyStore.convertirPrecio(getPrecioActual() * cantidad) }}
        </button>

        <button @click="emit('close')" class="w-full text-center text-xs text-brown-400 hover:text-brown-600 transition-colors py-1">
          Seguir comprando
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>