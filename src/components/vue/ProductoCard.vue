<script setup>
import { ref } from 'vue';
import { ShoppingCart, Package } from 'lucide-vue-next';

const props = defineProps({
  producto: {
    type: Object,
    required: true
  }
});

const modalAbierto = ref(false);
const imagenError = ref(false);

// Estado simplificado
const estadoConfig = {
  disponible: { texto: "Disponible", color: "text-green-500", bg: "bg-green-500/10", sePuedeComprar: true },
  proximamente: { texto: "Próximamente", color: "text-blue-500", bg: "bg-blue-500/10", sePuedeComprar: false }
};

const estado = estadoConfig[props.producto.estadoEnvio] || estadoConfig.disponible;

const agregarAlCarrito = (e) => {
  e?.stopPropagation();
  if (!estado.sePuedeComprar) {
    alert(`❌ ${estado.texto}. No disponible.`);
    return;
  }
  
  // Recuperar carrito del localStorage
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  const existente = carrito.find(item => item.id === props.producto.id);
  
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...props.producto, cantidad: 1 });
  }
  
  localStorage.setItem('carrito', JSON.stringify(carrito));
  
  // Disparar evento para actualizar otros componentes
  window.dispatchEvent(new Event('carrito-actualizado'));
  
  alert(`✓ ${props.producto.nombre} agregado al carrito`);
};

const abrirModal = (e) => {
  e?.stopPropagation();
  modalAbierto.value = true;
};

const cerrarModal = () => {
  modalAbierto.value = false;
};

const handleImageError = () => {
  imagenError.value = true;
};
</script>

<template>
  <div 
    v-if="producto"
    class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-amber-600 relative flex flex-col h-full"
    @click="abrirModal"
  >
    <!-- Badge de oferta -->
    <div v-if="producto.enOferta && producto.estadoEnvio === 'disponible'" class="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
      🔥 OFERTA
    </div>
    
    <!-- Badge de estado -->
    <div :class="[estado.bg, 'absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-bold']">
      <span :class="estado.color">{{ estado.texto }}</span>
    </div>
    
    <!-- Imagen -->
    <div class="h-48 sm:h-56 md:h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden">
      <img 
        v-if="producto.imagen && producto.imagen !== '' && !imagenError"
        :src="producto.imagen" 
        :alt="producto.nombre"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />
      <div v-else class="text-center p-4">
        <Package class="w-12 h-12 sm:w-16 sm:h-16 opacity-50 mx-auto mb-2" />
        <p class="text-gray-400 text-xs sm:text-sm">{{ producto.nombre?.substring(0, 20) || 'Perfume' }}...</p>
      </div>
    </div>
    
    <!-- Contenido -->
    <div class="p-4 sm:p-5 flex flex-col flex-grow">
      <h3 class="font-bold text-base sm:text-lg md:text-xl mb-2 text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-2">
        {{ producto.nombre }}
      </h3>
      
      <p class="text-gray-500 text-xs sm:text-sm mb-3 line-clamp-2 hidden sm:block">
        {{ producto.descripcion }}
      </p>
      
      <div class="mt-auto pt-3">
        <div v-if="producto.enOferta && producto.estadoEnvio === 'disponible'" class="flex flex-wrap items-baseline gap-2 mb-3">
          <span class="text-gray-400 line-through text-sm sm:text-base">${{ producto.oldPrice || producto.precio }}</span>
          <span class="text-2xl sm:text-3xl font-bold text-red-500">${{ producto.precioOferta || producto.precio }}</span>
        </div>
        <div v-else class="mb-3">
          <span class="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-700 block text-center sm:text-left">
            ${{ producto.precio }} USD
          </span>
        </div>
        
        <button 
          @click.stop="agregarAlCarrito"
          :disabled="!estado.sePuedeComprar"
          class="w-full bg-amber-800 hover:bg-amber-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <ShoppingCart class="w-4 h-4 sm:w-5 sm:h-5" /> 
          {{ estado.sePuedeComprar ? 'Agregar' : estado.texto }}
        </button>
      </div>
    </div>
  </div>
  
  <!-- Modal simplificado -->
  <div v-if="modalAbierto" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" @click.self="cerrarModal">
    <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <h3 class="text-xl font-bold mb-2">{{ producto.nombre }}</h3>
        <p class="text-gray-600 mb-4">{{ producto.descripcion }}</p>
        <p class="text-2xl font-bold text-amber-700 mb-4">${{ producto.precio }} USD</p>
        <button @click="agregarAlCarrito; cerrarModal()" class="w-full bg-amber-800 text-white py-2 rounded-full">Agregar al carrito</button>
        <button @click="cerrarModal" class="w-full mt-2 text-gray-500 py-2">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>