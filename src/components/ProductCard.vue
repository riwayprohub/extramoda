<script setup>
import { useRouter } from "vue-router"

defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
</script>

<template>
  <article
    class="product-card"
    @click="router.push({ name: 'product-detail', params: { id: product.id } })"
  >
    <div class="product-image">
      <img v-if="product.images?.length" :src="product.images[0]" :alt="product.name" />
      <div v-else class="no-image">Sin foto</div>

      <span v-if="product.badge === 'new'" class="badge badge-new">NEW IN</span>
      <span v-else-if="product.badge === 'oferta'" class="badge badge-oferta">OFERTA</span>
    </div>

    <div class="product-info">
      <span v-if="product.code" class="product-code">{{ product.code }}</span>
      <span class="product-category">{{ product.category }}</span>
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">Bs. {{ Number(product.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".") }}</p>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.product-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #f1f1f1;
}

.product-image img {
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
  font-size: 0.9rem;
}

.badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #fff;
}

.badge-new {
  background: #111;
}

.badge-oferta {
  background: #e63946;
}

.product-info {
  padding: 0.8rem 0.9rem;
  text-align: center;
}

.product-code,
.product-category {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #999;
  letter-spacing: 0.5px;
}

.product-name {
  font-size: 0.9rem;
  margin: 0.3rem 0;
  font-weight: 500;
  color: #333;
}

.product-price {
  font-weight: 700;
  color: #111;
  font-size: 0.95rem;
}
</style>
