<script setup>
import { storeToRefs } from "pinia"
import { useCartStore } from "../stores/cart.js"

const cartStore = useCartStore()
const { items, total } = storeToRefs(cartStore)
</script>

<template>
  <div class="container cart">
    <h1>Tu carrito</h1>

    <div v-if="items.length === 0" class="empty">
      <p>Tu carrito está vacío.</p>
      <RouterLink :to="{ name: 'shop' }">Ir a la tienda</RouterLink>
    </div>

    <div v-else>
      <div v-for="(item, index) in items" :key="index" class="cart-item">
        <img :src="item.image" :alt="item.name" />
        <div class="item-info">
          <h3>{{ item.name }}</h3>
          <span>Talla: {{ item.size }}</span>
          <span>Precio: Bs. {{ Number(item.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".") }}</span>
        </div>
        <div class="item-actions">
          <input
            type="number"
            min="1"
            :value="item.quantity"
            @change="(e) => cartStore.updateQuantity(item.productId, item.size, Number(e.target.value))"
          />
          <button class="remove-btn" @click="cartStore.removeItem(item.productId, item.size)">
            Eliminar
          </button>
        </div>
        <p class="item-total">Bs. {{ (item.price * item.quantity).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".") }}</p>
      </div>

      <div class="cart-summary">
        <h3>Total: Bs. {{ total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".") }}</h3>
        <RouterLink :to="{ name: 'checkout' }" class="checkout-btn">
          Finalizar compra
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart {
  padding: 2rem 1rem;
}

.empty {
  text-align: center;
  padding: 3rem;
  color: var(--color-muted);
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 1rem;
  align-items: center;
  background: #fff;
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1rem;
}

.cart-item img {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius);
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-actions input {
  width: 60px;
  padding: 0.3rem;
}

.remove-btn {
  background: var(--color-accent);
}

.item-total {
  font-weight: 700;
}

.cart-summary {
  margin-top: 1.5rem;
  text-align: right;
}

.checkout-btn {
  display: inline-block;
  background: var(--color-primary);
  color: #fff;
  padding: 0.8rem 1.8rem;
  border-radius: var(--radius);
  margin-top: 1rem;
}
</style>
