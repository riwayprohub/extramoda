<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import { useCartStore } from "../stores/cart.js"

const router = useRouter()
const cartStore = useCartStore()
const { items, total } = storeToRefs(cartStore)

const shipping = ref({
  name: "",
  address: "",
  phone: "",
  city: "",
})
const error = ref("")
const loading = ref(false)

function formatPrice(n) {
  return "Bs. " + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

async function onCheckout() {
  error.value = ""
  if (!shipping.value.name || !shipping.value.address || !shipping.value.phone) {
    error.value = "Completá los datos de envío"
    return
  }
  loading.value = true
  try {
    const order = await cartStore.checkout(shipping.value, null)
    alert("Pedido realizado correctamente")
    router.push({ name: "my-orders" })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container checkout">
    <h1>Finalizar compra</h1>

    <div v-if="items.length === 0" class="empty">
      <p>Tu carrito está vacío.</p>
      <RouterLink :to="{ name: 'shop' }">Ir a la tienda</RouterLink>
    </div>

    <div v-else class="layout">
      <div class="card">
        <h2>Resumen</h2>
        <div v-for="(item, i) in items" :key="i" class="line">
          <span>{{ item.name }} × {{ item.quantity }}</span>
          <span>{{ formatPrice(item.price * item.quantity) }}</span>
        </div>
        <div class="total">Total: <strong>{{ formatPrice(total) }}</strong></div>
      </div>

      <form class="card" @submit.prevent="onCheckout">
        <h2>Datos de envío</h2>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="shipping.name" required />
        </div>
        <div class="form-group">
          <label>Dirección</label>
          <input v-model="shipping.address" required />
        </div>
        <div class="form-group">
          <label>Ciudad</label>
          <input v-model="shipping.city" />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input v-model="shipping.phone" required />
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Procesando...' : 'Confirmar pedido' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.checkout {
  padding: 2rem 1rem;
  max-width: 800px;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

.card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
}

.line {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
}

.total {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.empty {
  text-align: center;
  padding: 3rem;
  color: #777;
}

@media (max-width: 700px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
