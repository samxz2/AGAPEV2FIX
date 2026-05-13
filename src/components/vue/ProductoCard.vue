<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useCarritoStore } from '../../store/carrito';
import { useMonedaStore } from '../../store/moneda';
import ProductoModal from './ProductoModal.vue';
import { ShoppingCart, Package } from 'lucide-vue-next';

const props = defineProps({
  producto: Object
});

const carritoStore = useCarritoStore();
const monedaStore = useMonedaStore();

const modalAbierto = ref(false);
const mostrarNotificacion = ref(false);
const productoAgregado = ref('');
const imagenError = ref(false);
const esFavorito = ref(false);
const precioFormateado = ref('');
const precioOfertaFormateado = ref('');
const oldPrecioFormateado = ref('');

const estadoConfig = {
  disponible: { texto: "Disponible", color: "text-green-500", bg: "bg-green-500/10", sePuedeComprar: true },
  transito: { texto: "En camino", color: "text-yellow-500", bg: "bg-yellow-500/10", sePuedeComprar: false },
  proximamente: { texto: "Próximamente", color: "text-blue-500", bg: "bg-blue-500/10", sePuedeComprar: false }
};

const estado = estadoConfig[props.producto.estadoEnvio] || estadoConfig.disponible;

const actualizarPrecios = () => {
  precioFormateado.value = monedaStore.getPrecioFormateado(props.producto.precio);
  if (props.producto.precioOferta) {
    precioOfertaFormateado.value = monedaStore.getPrecioFormateado(props.producto.precioOferta);
  }
  if (props.producto.oldPrice) {
    oldPrecioFormateado.value = monedaStore.getPrecioFormateado(props.producto.oldPrice);
  }
};

const agregarAlCarrito = () => {
  if (!estado.sePuedeComprar) {
    alert(`❌ ${estado.texto}. No disponible para comprar.`);
    return;
  }
  
  carritoStore.agregarProducto(props.producto, 1);
  productoAgregado.value = props.producto.nombre;
  mostrarNotificacion.value = true;
  setTimeout(() => {
    mostrarNotificacion.value = false;
  }, 2000);
};

const abrirModal = () => {
  modalAbierto.value = true;
};

const cerrarModal = () => {
  modalAbierto.value = false;
};

const handleImageError = () => {
  imagenError.value = true;
};

const actualizarMoneda = () => {
  actualizarPrecios();
};

onMounted(() => {
  actualizarPrecios();
  window.addEventListener('moneda-cambiada', actualizarMoneda);
});

onUnmounted(() => {
  window.removeEventListener('moneda-cambiada', actualizarMoneda);
});
</script>

<template>
  <div 
    class="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-primary-dark/30 hover:border-primary relative flex flex-col h-full"
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
    <div class="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-surface to-background flex items-center justify-center relative overflow-hidden">
      <img 
        v-if="props.producto.imagen && props.producto.imagen !== '' && !imagenError"
        :src="props.producto.imagen" 
        :alt="props.producto.nombre"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        @error="handleImageError"
      />
      <div v-else class="text-center p-4">
        <Package class="w-12 h-12 sm:w-16 sm:h-16 opacity-50 group-hover:scale-110 transition-transform duration-300 text-primary mx-auto mb-2" />
        <p class="text-text-muted text-xs sm:text-sm">{{ props.producto.nombre.substring(0, 20) }}...</p>
      </div>
    </div>
    
    <!-- Contenido de la card -->
    <div class="p-4 sm:p-5 flex flex-col flex-grow">
      <!-- Título -->
      <h3 class="font-bold text-base sm:text-lg md:text-xl mb-2 text-text group-hover:text-primary transition-colors line-clamp-2">
        {{ producto.nombre }}
      </h3>
      
      <!-- Descripción (oculta en móvil muy pequeño, visible en tablet/desktop) -->
      <p class="text-text-muted text-xs sm:text-sm mb-3 line-clamp-2 hidden sm:block">
        {{ producto.descripcion }}
      </p>
      
      <!-- PRECIO - MUY VISIBLE EN MÓVIL -->
      <div class="mt-auto pt-3">
        <!-- Versión oferta -->
        <div v-if="producto.enOferta && producto.estadoEnvio === 'disponible'" class="flex flex-wrap items-baseline gap-2 mb-3">
          <span class="text-text-muted line-through text-sm sm:text-base">{{ oldPrecioFormateado || precioFormateado }}</span>
          <span class="text-2xl sm:text-3xl font-bold text-red-500">{{ precioOfertaFormateado }}</span>
        </div>
        
        <!-- Versión normal -->
        <div v-else class="mb-3">
          <span class="text-2xl sm:text-3xl md:text-4xl font-bold text-primary block text-center sm:text-left">
            {{ precioFormateado }}
          </span>
        </div>
        
        <!-- Línea decorativa para destacar el precio en móvil -->
        <div class="w-12 h-0.5 bg-primary/30 mx-auto sm:mx-0 mb-3 sm:hidden"></div>
        
        <!-- Botón -->
        <button 
          @click.stop="agregarAlCarrito"
          :disabled="!estado.sePuedeComprar"
          class="w-full bg-primary-dark hover:bg-primary text-white px-3 sm:px-4 py-2 sm:py-3 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <ShoppingCart class="w-4 h-4 sm:w-5 sm:h-5" /> 
          {{ estado.sePuedeComprar ? 'Agregar' : estado.texto }}
        </button>
      </div>
    </div>
  </div>
  
  <!-- Modal -->
  <ProductoModal 
    :producto="producto" 
    :abierto="modalAbierto" 
    @cerrar="cerrarModal"
  />

  <!-- Notificación flotante -->
  <div 
    v-if="mostrarNotificacion"
    class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg z-50 text-sm sm:text-base whitespace-nowrap"
  >
    ✓ {{ productoAgregado }} agregado
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