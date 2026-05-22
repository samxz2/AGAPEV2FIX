<script setup lang="ts">
import { useCartStore } from '../stores/cartStore'
import { useCurrencyStore } from '../stores/currencyStore'
import { pinia } from '../plugins/pinia'
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, Shield, Truck } from 'lucide-vue-next'

const cart = useCartStore(pinia)
const currencyStore = useCurrencyStore(pinia)

function getPrecioItem(item: any): number {
  return item.enOferta && item.precioOferta ? item.precioOferta : item.precio
}
</script>

<template>
  <!-- Backdrop -->
  <div
    v-if="cart.isOpen"
    class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
    @click="cart.toggleCart()"
  />

  <!-- Drawer -->
  <div
    class="fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-gradient-to-b from-cream-50 to-white shadow-2xl flex flex-col transition-all duration-300"
    :class="cart.isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- Header -->
    <div class="bg-gradient-to-r from-brown-800 to-brown-700 px-5 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="relative">
            <ShoppingBag :size="24" class="text-cream-300" />
            <span
              v-if="cart.totalItems > 0"
              class="absolute -top-2 -right-2 bg-cream-300 text-brown-900 text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
            >
              {{ cart.totalItems }}
            </span>
          </div>
          <div>
            <h2 class="font-playfair text-lg text-cream-100 font-bold">Tu Carrito</h2>
            <p class="text-cream-300/60 text-xs">
              {{ currencyStore.currency === 'USD' ? 'Precios en USD' : 'Precios en Bs.' }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Indicador de moneda -->
          <span class="text-[10px] text-cream-300 font-medium bg-brown-600/50 px-2 py-0.5 rounded-full">
            {{ currencyStore.currency === 'USD' ? '$' : 'Bs.' }}
          </span>
          <button
            @click="cart.toggleCart()"
            class="text-cream-300 hover:text-cream-100 p-2 rounded-lg hover:bg-brown-600/50 transition-all"
          >
            <X :size="20" />
          </button>
        </div>
      </div>
    </div>

    <!-- Items -->
    <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      <!-- Vacío -->
      <div
        v-if="cart.items.length === 0"
        class="flex flex-col items-center justify-center h-full gap-4 text-brown-400"
      >
        <div class="w-24 h-24 bg-brown-100 rounded-full flex items-center justify-center">
          <ShoppingBag :size="40" class="text-brown-300" />
        </div>
        <div class="text-center">
          <p class="font-playfair text-xl text-brown-600">Tu carrito está vacío</p>
          <p class="text-sm text-brown-400 mt-1">Agrega algunos perfumes para continuar</p>
        </div>
        <button
          @click="cart.toggleCart()"
          class="bg-gradient-to-r from-brown-700 to-brown-600 text-cream-50 px-8 py-3 rounded-2xl text-sm font-bold hover:from-brown-600 hover:to-brown-500 transition-all shadow-lg"
        >
          Ver productos
        </button>
      </div>

      <!-- Lista de items -->
      <div
        v-for="item in cart.items"
        :key="item.id"
        class="bg-white rounded-2xl p-3 shadow-sm border border-brown-100 flex gap-3 items-center"
      >
        <img
          :src="item.imagen"
          :alt="item.nombre"
          class="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl shrink-0"
        />
        <div class="flex flex-col flex-1 gap-1 min-w-0">
          <p class="text-[10px] md:text-xs text-brown-400 uppercase tracking-wider">{{ item.categoria }}</p>
          <p class="text-xs md:text-sm font-semibold text-brown-800 leading-snug line-clamp-2">
            {{ item.nombre }}
          </p>
          <!-- Precio con cambio de moneda -->
          <p class="text-brown-600 font-bold text-sm md:text-base">
            {{ currencyStore.convertirPrecio(getPrecioItem(item)) }}
          </p>

          <!-- Controles cantidad -->
          <div class="flex items-center gap-2 mt-1">
            <div class="flex items-center gap-1 bg-brown-50 rounded-lg p-0.5">
              <button
                @click="cart.cambiarCantidad(item.id, item.cantidad - 1)"
                class="w-6 h-6 rounded-md bg-white hover:bg-brown-100 flex items-center justify-center transition-colors shadow-sm"
              >
                <Minus :size="10" class="text-brown-600" />
              </button>
              <span class="text-xs font-bold text-brown-800 w-5 text-center">
                {{ item.cantidad }}
              </span>
              <button
                @click="cart.cambiarCantidad(item.id, item.cantidad + 1)"
                class="w-6 h-6 rounded-md bg-white hover:bg-brown-100 flex items-center justify-center transition-colors shadow-sm"
              >
                <Plus :size="10" class="text-brown-600" />
              </button>
            </div>

            <button
              @click="cart.eliminarDelCarrito(item.id)"
              class="ml-auto text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-all"
            >
              <Trash2 :size="14" />
            </button>
          </div>
          <!-- Subtotal del item en moneda actual -->
          <p class="text-[10px] text-brown-400 mt-0.5">
            Subtotal: {{ currencyStore.convertirPrecio(getPrecioItem(item) * item.cantidad) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div
      v-if="cart.items.length > 0"
      class="border-t border-brown-200 px-5 py-4 bg-white space-y-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
    >
      <!-- Beneficios -->
      <div class="flex items-center gap-4 text-xs text-brown-500 justify-center">
        <span class="flex items-center gap-1">
          <Shield :size="12" class="text-green-500" />
          Originales
        </span>
        <span class="flex items-center gap-1">
          <Truck :size="12" class="text-cream-400" />
          Envío
        </span>
      </div>

      <!-- En la sección del total, reemplaza: -->
<div class="flex items-center justify-between">
  <span class="text-brown-600 text-sm">Total</span>
  <span class="text-lg font-bold font-playfair text-brown-800">
    {{ currencyStore.convertirPrecio(Number(cart.totalPriceUSD.toFixed(2))) }}
  </span>
</div>

      <!-- Botón WhatsApp -->
      <button
        @click="cart.generarMensajeWhatsapp()"
        class="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3.5 rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-lg hover:shadow-xl text-sm"
      >
        <MessageCircle :size="20" />
        Pedir por WhatsApp
      </button>

      <!-- Vaciar -->
      <button
        @click="cart.vaciarCarrito()"
        class="w-full text-center text-xs text-brown-400 hover:text-red-500 transition-colors py-1"
      >
        Vaciar carrito
      </button>
    </div>
  </div>
</template>