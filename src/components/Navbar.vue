<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { pinia } from '../plugins/pinia'
import { ShoppingBag, Search, Menu, X } from 'lucide-vue-next'
import CurrencyToggle from './CurrencyToggle.vue'

const cart = useCartStore(pinia)
const menuOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const isScrolled = ref(false)

const categorias = [
  { label: 'Caballero', value: 'caballero', svg: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8' },
  { label: 'Damas', value: 'dama', svg: 'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M12 1v4 M12 19v4 M4.22 4.22l2.83 2.83 M16.95 16.95l2.83 2.83 M1 12h4 M19 12h4 M4.22 19.78l2.83-2.83 M16.95 7.05l2.83-2.83' },
  { label: 'Unisex', value: 'unisex', svg: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { label: 'Sets', value: 'sets', svg: 'M3 8h18v12H3z M3 8V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2 M12 6v14 M8 6V4 M16 6V4' },
]

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

function irACategoria(cat: string) {
  window.location.href = `/?categoria=${cat}`
  menuOpen.value = false
}

function buscar() {
  if (searchQuery.value.trim()) {
    window.location.href = `/?buscar=${encodeURIComponent(searchQuery.value)}`
    searchOpen.value = false
  }
}
</script>

<template>
  <header 
    :class="[
      'sticky top-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-brown-800/95 backdrop-blur-md shadow-lg' : 'bg-brown-800'
    ]"
  >
    <!-- Main Navbar -->
    <div class="max-w-7xl mx-auto px-4 py-2.5">
      <div class="flex items-center justify-between gap-2">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-2 shrink-0">
          <img 
            src="https://i.ibb.co/CpHdX08t/1001879919.png" 
            alt="Agape Collection Parfum"
            class="h-8 w-auto md:h-10"
            onerror="this.style.display='none'"
          />
          <div class="flex flex-col leading-tight">
            <span class="font-playfair text-xs md:text-base text-cream-100 font-bold tracking-wider">
              Agape
            </span>
            <span class="text-cream-300/80 text-[8px] md:text-[10px] tracking-[0.3em] uppercase">
              Parfum
            </span>
          </div>
        </a>

        <!-- Search - Desktop -->
        <div class="hidden md:flex flex-1 max-w-md mx-4">
          <form @submit.prevent="buscar" class="w-full relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar perfume..."
              class="w-full bg-brown-700/50 text-cream-100 placeholder-cream-300/40 rounded-full pl-4 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-cream-300/50 transition-all border border-brown-600/50 focus:border-cream-300/50"
            />
            <button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 text-cream-300/60 hover:text-cream-200 transition-colors">
              <Search :size="18" />
            </button>
          </form>
        </div>

        <!-- Right side - SIEMPRE VISIBLE en móvil y desktop -->
        <div class="flex items-center gap-1">
          <!-- Currency Toggle - SIEMPRE VISIBLE -->
          <CurrencyToggle />

          <!-- Search Mobile -->
          <button @click="searchOpen = !searchOpen" class="md:hidden text-cream-200 hover:text-cream-100 transition-colors p-1.5 rounded-lg hover:bg-brown-700/50 cursor-pointer">
            <Search :size="18" />
          </button>

          <!-- Cart -->
          <button @click="cart.toggleCart()" class="relative text-cream-200 hover:text-cream-100 transition-colors p-1.5 rounded-lg hover:bg-brown-700/50 cursor-pointer">
            <ShoppingBag :size="20" />
            <span v-if="cart.totalItems > 0" class="absolute -top-0.5 -right-0.5 bg-cream-300 text-brown-900 text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 shadow-lg">
              {{ cart.totalItems }}
            </span>
          </button>

          <!-- Hamburger Mobile -->
          <button @click="menuOpen = !menuOpen" class="md:hidden text-cream-200 hover:text-cream-100 transition-colors p-1.5 rounded-lg hover:bg-brown-700/50 cursor-pointer">
            <Menu v-if="!menuOpen" :size="20" />
            <X v-else :size="20" />
          </button>
        </div>
      </div>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-1 mt-2 border-t border-brown-700/30 pt-2">
        <a href="/" class="text-cream-200/80 hover:text-cream-100 text-xs px-3 py-1.5 rounded-lg hover:bg-brown-700/50 transition-all">
          Inicio
        </a>
        <button v-for="cat in categorias" :key="cat.value" @click="irACategoria(cat.value)" class="text-cream-200/80 hover:text-cream-100 text-xs px-3 py-1.5 rounded-lg hover:bg-brown-700/50 transition-all flex items-center gap-1.5 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path :d="cat.svg"/>
          </svg>
          {{ cat.label }}
        </button>
      </nav>
    </div>

    <!-- Search Bar Mobile -->
    <div
      v-if="searchOpen"
      class="md:hidden border-t border-brown-700/50 bg-brown-800/95 backdrop-blur-md px-4 py-3"
    >
      <form @submit.prevent="buscar" class="flex gap-2">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar perfume..."
            class="w-full bg-brown-700/50 text-cream-100 placeholder-cream-300/40 rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cream-300/50 border border-brown-600/50"
            autofocus
          />
          <Search :size="18" class="absolute right-3 top-1/2 -translate-y-1/2 text-cream-300/40" />
        </div>
        <button type="submit" class="bg-cream-300 text-brown-900 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-cream-200 transition-colors cursor-pointer">
          Buscar
        </button>
      </form>
    </div>

    <!-- Mobile Menu Overlay -->
    <div
      v-if="menuOpen"
      class="fixed inset-0 top-[57px] z-40 bg-black/60 backdrop-blur-sm md:hidden"
      @click="menuOpen = false"
    />

    <!-- Mobile Menu -->
    <div
      v-if="menuOpen"
      class="fixed left-0 right-0 top-[57px] z-50 bg-brown-800 border-t border-brown-700 shadow-2xl md:hidden max-h-[calc(100vh-57px)] overflow-y-auto"
    >
      <div class="px-4 py-4 space-y-1">
        <a
          href="/"
          @click="menuOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-cream-200 hover:text-cream-100 hover:bg-brown-700/50 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span class="font-medium">Inicio</span>
        </a>

        <div class="h-px bg-brown-700/50 my-2" />

        <p class="px-4 py-2 text-xs text-cream-300/60 uppercase tracking-wider font-semibold">
          Categorías
        </p>

        <button
          v-for="cat in categorias"
          :key="cat.value"
          @click="irACategoria(cat.value)"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-cream-200 hover:text-cream-100 hover:bg-brown-700/50 transition-all text-left cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path :d="cat.svg"/>
          </svg>
          <span class="font-medium">{{ cat.label }}</span>
        </button>
      </div>
    </div>
  </header>
</template>