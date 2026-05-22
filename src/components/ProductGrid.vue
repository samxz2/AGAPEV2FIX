<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { productos, type Producto } from '../data/productos'
import ProductCard from './ProductCard.vue'
import { Search, Filter, Grid3X3, List } from 'lucide-vue-next'

const categoriaActiva = ref('todos')
const busqueda = ref('')
const viewMode = ref<'grid' | 'list'>('grid')

const categorias = [
  { label: 'Todos', value: 'todos', icon: '' },
  { label: 'Caballero', value: 'caballero', icon: '' },
  { label: 'Damas', value: 'dama', icon: '' },
  { label: 'Unisex', value: 'unisex', icon: '' },
  { label: 'Sets', value: 'sets', icon: '' },
]

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const cat = params.get('categoria')
  const buscar = params.get('buscar')
  if (cat) categoriaActiva.value = cat
  if (buscar) busqueda.value = buscar
})

const productosFiltrados = computed(() => {
  let resultado = productos as Producto[]

  if (categoriaActiva.value !== 'todos') {
    resultado = resultado.filter(p => p.categoria === categoriaActiva.value)
  }

  if (busqueda.value.trim()) {
    const q = busqueda.value.toLowerCase().trim()
    resultado = resultado.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    )
  }

  return resultado
})
</script>

<template>
  <div>
    <!-- Filters Bar -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
      <!-- Search -->
      <div class="relative w-full sm:w-72">
        <Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brown-200 bg-white text-brown-800 text-sm outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 placeholder-brown-300 transition-all"
        />
      </div>

      <!-- View Toggle -->
      <div class="flex items-center gap-2">
        <button
          @click="viewMode = 'grid'"
          :class="viewMode === 'grid' ? 'bg-brown-700 text-cream-50' : 'bg-white text-brown-500 hover:bg-brown-100'"
          class="p-2 rounded-lg transition-all text-sm"
        >
          <Grid3X3 :size="18" />
        </button>
        <button
          @click="viewMode = 'list'"
          :class="viewMode === 'list' ? 'bg-brown-700 text-cream-50' : 'bg-white text-brown-500 hover:bg-brown-100'"
          class="p-2 rounded-lg transition-all text-sm"
        >
          <List :size="18" />
        </button>
      </div>
    </div>

    <!-- Categorías - Scroll horizontal en mobile -->
    <div class="overflow-x-auto pb-2 mb-6 -mx-4 px-4">
      <div class="flex gap-2 min-w-max">
        <button
          v-for="cat in categorias"
          :key="cat.value"
          @click="categoriaActiva = cat.value"
          class="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap border"
          :class="categoriaActiva === cat.value
            ? 'bg-brown-700 text-cream-50 border-brown-700 shadow-md'
            : 'bg-white text-brown-600 border-brown-200 hover:border-gold/50 hover:text-brown-700'"
        >
          <span>{{ cat.icon }}</span>
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="font-playfair text-xl md:text-2xl font-bold text-brown-800 capitalize">
          {{ categoriaActiva === 'todos' ? 'Toda la Colección' : categoriaActiva }}
        </h2>
        <p class="text-xs text-brown-400 mt-0.5">
          {{ productosFiltrados.length }} producto{{ productosFiltrados.length !== 1 ? 's' : '' }} encontrado{{ productosFiltrados.length !== 1 ? 's' : '' }}
        </p>
      </div>
    </div>

    <!-- Sin resultados -->
    <div
      v-if="productosFiltrados.length === 0"
      class="text-center py-20"
    >
      <div class="w-20 h-20 bg-brown-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search :size="30" class="text-brown-400" />
      </div>
      <p class="font-playfair text-xl text-brown-600">No encontramos resultados</p>
      <p class="text-sm text-brown-400 mt-2">Prueba con otra búsqueda o categoría</p>
      <button
        @click="busqueda = ''; categoriaActiva = 'todos'"
        class="mt-4 bg-brown-700 text-cream-50 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-brown-600 transition-colors"
      >
        Limpiar filtros
      </button>
    </div>

    <!-- Grid -->
    <div
      v-else
      :class="viewMode === 'grid'
        ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4'
        : 'flex flex-col gap-3'"
    >
      <ProductCard
        v-for="producto in productosFiltrados"
        :key="producto.id"
        :producto="producto"
        :class="viewMode === 'list' ? 'flex-row' : ''"
      />
    </div>
  </div>
</template>