<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { getProduct } from "../api/products.js"
import { demoItems } from "../data/demoData.js"

const route = useRoute()

const product = ref(null)
const loading = ref(true)
const error = ref("")
const activeImage = ref(0)

function formatPrice(n) {
  return "Bs. " + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

async function load() {
  try {
    const res = await getProduct(route.params.id)
    product.value = res.data.product
  } catch {
    // Backend no disponible → buscar en datos demo
    const demo = demoItems.find((i) => String(i.id) === String(route.params.id))
    if (demo) {
      product.value = demo
    } else {
      error.value = "Producto no encontrado"
    }
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="container detail">
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="product" class="detail-grid">
      <div class="detail-gallery">
        <div class="main-image">
          <img
            v-if="product.images?.length"
            :src="product.images[activeImage]"
            :alt="product.name"
          />
          <div v-else class="no-image">Sin foto</div>
        </div>
        <div v-if="product.images?.length > 1" class="thumbs">
          <img
            v-for="(img, i) in product.images"
            :key="i"
            :src="img"
            class="thumb"
            :class="{ active: activeImage === i }"
            @click="activeImage = i"
          />
        </div>
      </div>

      <div class="detail-info">
        <span v-if="product.code" class="code">{{ product.code }}</span>
        <span class="category">{{ product.category }}</span>
        <h1>{{ product.name }}</h1>
        <p class="price">{{ formatPrice(product.price) }}</p>
        <p v-if="product.description" class="desc">{{ product.description }}</p>

        <div v-if="product.badge === 'new'" class="tag tag-new">NEW IN</div>
        <div v-else-if="product.badge === 'oferta'" class="tag tag-oferta">OFERTA</div>

        <p class="stock">
          {{ product.stock > 0 ? `Stock disponible: ${product.stock}` : 'Agotado' }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail {
  padding: 2rem 1rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.main-image {
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 4px;
  background: #f1f1f1;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.thumbs {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.8rem;
  overflow-x: auto;
}

.thumb {
  width: 70px;
  height: 90px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
}

.thumb.active {
  border-color: #111;
}

.code,
.category {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #999;
  letter-spacing: 0.5px;
}

.price {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.desc {
  margin-bottom: 1rem;
  color: #555;
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #fff;
  margin-bottom: 1rem;
}

.tag-new {
  background: #111;
}

.tag-oferta {
  background: #e63946;
}

.stock {
  color: #777;
  font-size: 0.9rem;
}

@media (max-width: 720px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
