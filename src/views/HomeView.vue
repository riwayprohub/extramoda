<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import { useProductsStore } from "../stores/products.js"
import ProductCard from "../components/ProductCard.vue"
import { getHeroImages } from "../api/hero.js"

const router = useRouter()
const productsStore = useProductsStore()
const { products, loading } = storeToRefs(productsStore)
const newIn = ref([])
const offers = ref([])

// Imágenes del fondo negro del Home (hasta 3, manejadas desde el panel admin)
const heroImages = ref([])

// Si no hay imágenes cargadas todavía (o el backend está caído), usa unas
// de demostración para que el collage no quede vacío.
const demoHero = [
  { image: "https://picsum.photos/seed/extra1/800/1200" },
  { image: "https://picsum.photos/seed/extra2/800/1200" },
  { image: "https://picsum.photos/seed/extra3/800/1200" },
]

// Se muestran SIEMPRE 3 fotos juntas en el collage. Si se subieron menos
// (o ninguna), se completan con las de demostración.
const collage = computed(() => {
  const loaded = heroImages.value.map((h) => ({ image: h.image }))
  const result = []
  for (let i = 0; i < 3; i++) {
    result.push(loaded[i] || demoHero[i])
  }
  return result
})

async function loadHeroImages() {
  try {
    const res = await getHeroImages()
    heroImages.value = res.data.images
  } catch {
    heroImages.value = []
  }
}

async function goCategory(category) {
  router.push({ name: "shop", query: { category } })
}

onMounted(async () => {
  await loadHeroImages()

  // Cargar los últimos productos subidos (aparece cualquier imagen cargada),
  // excluyendo las ofertas que ya se muestran en su propia sección
  const latest = await productsStore.fetchLatest()
  newIn.value = latest.filter((p) => p.badge !== "oferta")

  // Cargar ofertas
  const offRes = await productsStore.fetchAllByBadge("oferta")
  offers.value = offRes
})
</script>

<template>
  <section class="hero">
    <div class="hero-collage">
      <div
        v-for="(slide, i) in collage"
        :key="slide.image + i"
        class="hero-photo"
        :style="{ backgroundImage: `url('${slide.image}')` }"
      ></div>
    </div>

    <div class="hero-overlay"></div>

    <div class="container hero-content">
      <p class="hero-kicker">VENTA DE PRENDAS VARONIL</p>
      <h1>New In</h1>
      <p class="hero-sub">Mirá las últimas novedades de nuestra colección</p>
      <RouterLink :to="{ name: 'shop', query: { badge: 'new' } }" class="hero-btn">
        Ver New In
      </RouterLink>
    </div>
  </section>

  <section class="container section">
    <div class="section-head">
      <h2>Nuevos Ingresos</h2>
      <RouterLink :to="{ name: 'shop', query: { badge: 'new' } }" class="see-all">Ver todos →</RouterLink>
    </div>
    <div v-if="loading" class="loading">Cargando...</div>
    <div v-else-if="newIn.length" class="grid-products">
      <ProductCard v-for="product in newIn" :key="product.id" :product="product" />
    </div>
  </section>

  <section class="container section">
    <div class="section-head">
      <h2>Ofertas</h2>
      <RouterLink :to="{ name: 'shop', query: { badge: 'oferta' } }" class="see-all">Ver todos →</RouterLink>
    </div>
    <div v-if="offers.length" class="grid-products">
      <ProductCard v-for="product in offers" :key="product.id" :product="product" />
    </div>
  </section>

  <section class="container section">
    <h2 class="cats-title">Comprá por categoría</h2>
    <div class="cats-grid">
      <div class="cat-card" @click="goCategory('Pantalones')">
        <h3>PANTALONES</h3>
      </div>
      <div class="cat-card" @click="goCategory('Polleras')">
        <h3>JEANS</h3>
      </div>
      <div class="cat-card" @click="goCategory('Shorts')">
        <h3>SHORTS</h3>
      </div>
      <div class="cat-card" @click="goCategory('Partes de arriba')">
        <h3>PARTES DE ARRIBA</h3>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #1c1c1c, #3d3d3d);
  color: #fff;
  text-align: center;
  padding: 8rem 1rem;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-collage {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 0;
}

.hero-photo {
  background-size: cover;
  background-position: center;
  height: 100%;
}

@media (max-width: 700px) {
  .hero-collage {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .hero-photo:last-child {
    grid-column: span 2;
  }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.6));
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-kicker {
  font-size: 0.85rem;
  letter-spacing: 3px;
  opacity: 0.85;
  margin-bottom: 0.8rem;
}

.hero-content h1 {
  font-size: 3.2rem;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
}

.hero-sub {
  font-size: 1.15rem;
  opacity: 0.9;
  margin-bottom: 1.8rem;
}

.hero-btn {
  background: #fff;
  color: #111;
  padding: 0.8rem 2rem;
  border-radius: 2px;
  font-weight: 700;
  letter-spacing: 1px;
  display: inline-block;
}

.section {
  padding: 2.5rem 1rem;
}

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.section-head h2 {
  font-size: 1.5rem;
  letter-spacing: 1px;
}

.see-all {
  color: #777;
  font-size: 0.85rem;
}

.cats-title {
  text-align: center;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
}

.cats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.cat-card {
  background: #e9e0d3;
  padding: 3rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.cat-card:hover {
  transform: translateY(-3px);
}

.cat-card h3 {
  letter-spacing: 2px;
  font-size: 1.1rem;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: #999;
}
</style>
