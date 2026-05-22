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
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden md:flex items-center justify-center p-6"
    @click="onBackdrop"
  >
    <div
      class="bg-cream-50 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex max-h-[85vh] animate-fade-in"
      @click.stop
    >
      <!-- LADO IZQUIERDO - Imagen -->
      <div class="w-1/2 relative bg-gradient-to-br from-cream-100 to-cream-50 min-h-[500px]">
        <img
          :src="producto.imagen"
          :alt="producto.nombre"
          class="w-full h-full object-cover"
        />
        
        <button @click="emit('close')" class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg">
          <X :size="18" class="text-brown-700" />
        </button>

        <div class="absolute top-4 left-4 flex flex-col gap-2">
          <span v-if="producto.enOferta" class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            EN OFERTA
          </span>
        </div>

        <div class="absolute bottom-4 left-4">
          <span class="text-xs px-3 py-1 rounded-full font-semibold capitalize shadow-lg" :class="producto.estadoEnvio === 'disponible' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'">
            {{ producto.estadoEnvio === 'disponible' ? '✅ Disponible' : '❌ Agotado' }}
          </span>
        </div>
      </div>

      <!-- LADO DERECHO - Información -->
      <div class="w-1/2 overflow-y-auto p-8 space-y-5">
        <div class="flex items-center justify-between">
          <span class="text-xs text-brown-400 uppercase tracking-widest font-semibold bg-cream-100 px-3 py-1 rounded-full inline-block">
            {{ producto.categoria }}
          </span>
          <span class="text-xs text-brown-400 font-medium bg-cream-100 px-2.5 py-1 rounded-full">
            {{ currencyStore.currency === 'USD' ? '$ USD' : 'Bs.' }}
          </span>
        </div>

        <h2 class="font-playfair text-2xl text-brown-800 font-bold leading-tight">
          {{ producto.nombre }}
        </h2>

        <div class="flex items-baseline gap-3">
          <span class="text-4xl font-bold" :class="producto.enOferta ? 'text-red-600' : 'text-brown-700'">
            {{ currencyStore.convertirPrecio(getPrecioActual()) }}
          </span>
          <span v-if="producto.oldPrice" class="text-lg text-brown-300 line-through">
            {{ currencyStore.convertirPrecio(producto.oldPrice) }}
          </span>
          <span v-if="producto.enOferta && producto.oldPrice" class="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
            -{{ Math.round(((producto.oldPrice - getPrecioActual()) / producto.oldPrice) * 100) }}%
          </span>
        </div>

        <div class="bg-cream-100 rounded-2xl p-4 border border-cream-200">
          <p class="text-brown-600 text-sm leading-relaxed whitespace-pre-line">{{ producto.descripcion }}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white rounded-xl p-3 border border-brown-100">
            <p class="text-xs text-brown-400 uppercase tracking-wider">Intensidad</p>
            <p class="font-semibold text-brown-700 text-sm mt-0.5">{{ producto.intensidad }}</p>
          </div>
          <div class="bg-white rounded-xl p-3 border border-brown-100">
            <p class="text-xs text-brown-400 uppercase tracking-wider">Estado</p>
            <p class="font-semibold text-sm mt-0.5 capitalize" :class="producto.estadoEnvio === 'disponible' ? 'text-green-600' : 'text-red-600'">{{ producto.estadoEnvio }}</p>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex items-center gap-2 text-sm text-brown-600">
            <Shield :size="16" class="text-green-500 shrink-0" />
            <span>Producto 100% original</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-brown-600">
            <Truck :size="16" class="text-brown-500 shrink-0" />
            <span>Envío a toda Venezuela</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-brown-600">
            <Package :size="16" class="text-brown-500 shrink-0" />
            <span>Empaquetado seguro</span>
          </div>
        </div>

        <!-- Cantidad SIN LÍMITE -->
        <div class="flex items-center gap-4">
          <span class="text-sm text-brown-600 font-medium">Cantidad:</span>
          <div class="flex items-center gap-3 bg-white rounded-xl border border-brown-200 p-1">
            <button 
              @click="cantidad = Math.max(1, cantidad - 1)" 
              class="w-8 h-8 rounded-lg bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-brown-700 font-bold transition-colors"
            >
              <Minus :size="14" />
            </button>
            <input 
              v-model.number="cantidad" 
              type="number" 
              min="1"
              class="w-14 text-center font-bold text-brown-800 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button 
              @click="cantidad = cantidad + 1" 
              class="w-8 h-8 rounded-lg bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-brown-700 font-bold transition-colors"
            >
              <Plus :size="14" />
            </button>
          </div>
        </div>

        <button @click="addWithQuantity" class="w-full flex items-center justify-center gap-3 bg-brown-700 hover:bg-brown-600 text-cream-50 font-bold py-4 rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-lg hover:shadow-xl text-base">
          <ShoppingCart :size="20" />
          Añadir al carrito — {{ currencyStore.convertirPrecio(getPrecioActual() * cantidad) }}
        </button>

        <button @click="emit('close')" class="w-full text-center text-sm text-brown-400 hover:text-brown-600 transition-colors py-2">
          Seguir comprando
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>