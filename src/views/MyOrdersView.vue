<script setup>
import { ref, onMounted } from "vue"
import { getMyOrders } from "../api/orders.js"

const orders = ref([])
const loading = ref(true)
const error = ref("")

function formatPrice(n) {
  return "Bs. " + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

onMounted(async () => {
  try {
    const res = await getMyOrders()
    orders.value = res.data.orders
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container orders">
    <h1>Mis pedidos</h1>

    <div v-if="loading">Cargando...</div>
    <div v-else-if="error" class="error-msg">{{ error }}</div>
    <div v-else-if="orders.length === 0" class="empty">
      <p>No tenés pedidos todavía.</p>
      <RouterLink :to="{ name: 'shop' }">Ir a la tienda</RouterLink>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-head">
          <strong>Pedido #{{ order.id }}</strong>
          <span class="status">{{ order.status }}</span>
        </div>
        <p class="order-date">{{ new Date(order.createdAt).toLocaleDateString('es-AR') }}</p>
        <p class="order-total">Total: {{ formatPrice(order.total) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders {
  padding: 2rem 1rem;
  max-width: 700px;
}

.empty {
  text-align: center;
  padding: 3rem;
  color: #777;
}

.order-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 1rem;
}

.order-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  background: #eee;
  padding: 2px 10px;
  border-radius: 3px;
  text-transform: capitalize;
  font-size: 0.8rem;
}

.order-date {
  color: #777;
  font-size: 0.85rem;
  margin: 0.3rem 0;
}

.order-total {
  font-weight: 700;
}
</style>
