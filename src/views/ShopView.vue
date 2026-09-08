<script setup>
import { ref, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import { storeToRefs } from "pinia"
import { useProductsStore } from "../stores/products.js"
import ProductCard from "../components/ProductCard.vue"

const route = useRoute()
const productsStore = useProductsStore()
const { products, categories, loading, totalPages, page } = storeToRefs(productsStore)

const selectedCategory = ref(route.query.category || "")
const selectedBadge = ref(route.query.badge || "")
const pageSize = ref(12)

function load() {
  productsStore.fetchProducts({
    category: selectedCategory.value || undefined,
    badge: selectedBadge.value || undefined,
    pageSize: pageSize.value,
  })
}

watch(() => route.query, () => {
  selectedCategory.value = route.query.category || ""
  selectedBadge.value = route.query.badge || ""
  page.value = 1
  load()
})

function applyFilters() {
  page.value = 1
  load()
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
    load()
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value--
    load()
  }
}

onMounted(async () => {
  await productsStore.fetchCategories()
  load()
})
</script>

<template>
  <div class="container shop">
    <h1 class="shop-title">
      {{ selectedBadge === 'new' ? 'New In' : selectedBadge === 'oferta' ? 'Ofertas' : selectedCategory || 'Catálogo' }}
    </h1>

    <div class="filters">
      <select v-model="selectedCategory" @change="selectedBadge = ''; applyFilters()">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select v-model="selectedBadge" @change="selectedCategory = ''; applyFilters()">
        <option value="">Sin filtro</option>
        <option value="new">New In</option>
        <option value="oferta">Ofertas</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Cargando...</div>
    <div v-else-if="products.length === 0" class="loading">
      No hay productos en esta sección.
    </div>
    <div v-else class="grid-products">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button :disabled="page <= 1" @click="prevPage">← Anterior</button>
      <span>Página {{ page }} de {{ totalPages }}</span>
      <button :disabled="page >= totalPages" @click="nextPage">Siguiente →</button>
    </div>
  </div>
</template>

<style scoped>
.shop {
  padding: 2rem 1rem;
}

.shop-title {
  text-align: center;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin: 1rem 0 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filters select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 2px;
  background: #fff;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: #999;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
</style>
