<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { X, ShoppingCart, Shield, Truck, Package, Minus, Plus } from 'lucide-vue-next'
import type { Producto } from '../data/productos'

const props = defineProps<{ producto: Producto }>()
const emit = defineEmits(['close', 'add-to-cart'])
const isLiked = ref(false)
const cantidad = ref(1)
const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)

function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}

function addWithQuantity() {
  for (let i = 0; i < cantidad.value; i++) {
    emit('add-to-cart')
  }
  emit('close')
}

// Touch events para cerrar con swipe
function onTouchStart(e: TouchEvent) {
  if (e.target === e.currentTarget) {
    startY.value = e.touches[0].clientY
    isDragging.value = true
  }
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  currentY.value = e.touches[0].clientY
  const diff = currentY.value - startY.value
  if (diff > 0) {
    const modal = e.currentTarget as HTMLElement
    modal.style.transform = `translateY(${diff}px)`
    modal.style.transition = 'none'
  }
}

function onTouchEnd(e: TouchEvent) {
  if (!isDragging.value) return
  isDragging.value = false
  const diff = currentY.value - startY.value
  const modal = e.currentTarget as HTMLElement
  modal.style.transition = 'transform 0.3s ease-out'
  
  if (diff > 100) {
    emit('close')
  } else {
    modal.style.transform = 'translateY(0)'
  }
}

// Prevenir scroll del body
onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 bg-black/50 flex items-end justify-center overflow-hidden"
    @click="onBackdrop"
  >
    <!-- Modal Container -->
    <div
      class="bg-cream-50 w-full max-h-[92vh] rounded-t-3xl overflow-hidden shadow-2xl flex flex-col animate-slide-up"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <!-- Swipe Indicator -->
      <div class="flex justify-center pt-3 pb-1">
        <div class="w-10 h-1 bg-brown-300 rounded-full"></div>
      </div>

      <!-- Close Button -->
      <div class="flex justify-between items-center px-4 pb-2">
        <span class="text-[10px] text-brown-400 uppercase tracking-widest font-semibold bg-cream-100 px-2.5 py-1 rounded-full">
          {{ producto.categoria }}
        </span>
        <button
          @click="emit('close')"
          class="bg-brown-100 hover:bg-brown-200 rounded-full p-1.5 transition-colors"
        >
          <X :size="16" class="text-brown-600" />
        </button>
      </div>

      <!-- Contenido scrollable -->
      <div class="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        <!-- Imagen -->
        <div class="relative bg-cream-50 rounded-2xl overflow-hidden h-48">
          <img
            :src="producto.imagen"
            :alt="producto.nombre"
            class="w-full h-full object-cover"
          />
          
          <!-- Badges -->
          <div class="absolute top-2 left-2 flex flex-col gap-1">
            <span
              v-if="producto.enOferta"
              class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg"
            >
              EN OFERTA
            </span>
          </div>

          <!-- Like -->
          <button
            @click="isLiked = !isLiked"
            class="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 hover:bg-white transition-colors shadow-lg"
          >
            <Heart
              :size="16"
              :class="isLiked ? 'fill-red-500 text-red-500' : 'text-brown-600'"
            />
          </button>
        </div>

        <!-- Nombre -->
        <h2 class="font-playfair text-base text-brown-800 font-bold leading-snug">
          {{ producto.nombre }}
        </h2>

        <!-- Precio -->
        <div class="flex items-baseline gap-2">
          <span
            class="text-xl font-bold"
            :class="producto.enOferta ? 'text-red-600' : 'text-brown-700'"
          >
            ${{ producto.enOferta && producto.precioOferta ? producto.precioOferta : producto.precio }}
          </span>
          <span v-if="producto.oldPrice" class="text-sm text-brown-300 line-through">
            ${{ producto.oldPrice }}
          </span>
          <span
            v-if="producto.enOferta && producto.oldPrice"
            class="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded"
          >
            -{{ Math.round(((producto.oldPrice - (producto.precioOferta || producto.precio)) / producto.oldPrice) * 100) }}%
          </span>
        </div>

        <!-- Descripción -->
        <div class="bg-cream-100 rounded-xl p-3 border border-cream-200">
          <p class="text-brown-600 text-xs leading-relaxed whitespace-pre-line">
            {{ producto.descripcion }}
          </p>
        </div>

        <!-- Características -->
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-white rounded-xl p-2.5 border border-brown-100">
            <p class="text-[10px] text-brown-400 uppercase tracking-wider">Intensidad</p>
            <p class="font-semibold text-brown-700 text-xs mt-0.5">{{ producto.intensidad }}</p>
          </div>
          <div class="bg-white rounded-xl p-2.5 border border-brown-100">
            <p class="text-[10px] text-brown-400 uppercase tracking-wider">Estado</p>
            <p class="font-semibold text-xs mt-0.5 capitalize" :class="producto.estadoEnvio === 'disponible' ? 'text-green-600' : 'text-red-600'">
              {{ producto.estadoEnvio }}
            </p>
          </div>
        </div>

        <!-- Beneficios -->
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

        <!-- Cantidad -->
        <div class="flex items-center justify-between">
          <span class="text-xs text-brown-600 font-medium">Cantidad:</span>
          <div class="flex items-center gap-2 bg-white rounded-lg border border-brown-200 p-0.5">
            <button
              @click="cantidad = Math.max(1, cantidad - 1)"
              class="w-7 h-7 rounded-md bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-brown-700 font-bold transition-colors"
            >
              <Minus :size="12" />
            </button>
            <span class="w-6 text-center font-bold text-brown-800 text-sm">{{ cantidad }}</span>
            <button
              @click="cantidad = Math.min(10, cantidad + 1)"
              class="w-7 h-7 rounded-md bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-brown-700 font-bold transition-colors"
            >
              <Plus :size="12" />
            </button>
          </div>
        </div>

        <!-- Botón -->
        <button
          @click="addWithQuantity"
          class="w-full flex items-center justify-center gap-2 bg-brown-700 hover:bg-brown-600 text-cream-50 font-bold py-3 rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-lg text-sm"
        >
          <ShoppingCart :size="18" />
          Añadir — ${{ ((producto.enOferta && producto.precioOferta ? producto.precioOferta : producto.precio) * cantidad).toFixed(2) }}
        </button>

        <!-- Seguir comprando -->
        <button
          @click="emit('close')"
          class="w-full text-center text-xs text-brown-400 hover:text-brown-600 transition-colors py-1"
        >
          Seguir comprando
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

/* Para desktop */
@media (min-width: 768px) {
  div[class*="fixed"] {
    align-items: center;
    padding: 1rem;
  }
  
  div[class*="animate-slide-up"] {
    max-width: 48rem;
    max-height: 90vh;
    border-radius: 1.5rem;
    flex-direction: row;
    animation: fade-in 0.2s ease-out;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>