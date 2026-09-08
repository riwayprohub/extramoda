import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { createOrder } from "../api/orders.js"

export const useCartStore = defineStore("cart", () => {
  const items = ref(JSON.parse(localStorage.getItem("cart") || "[]"))

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  function persist() {
    localStorage.setItem("cart", JSON.stringify(items.value))
  }

  function addItem(product, size, quantity = 1) {
    const existing = items.value.find(
      (i) => i.productId === product.id && i.size === size
    )
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0] || "",
        size,
        quantity,
      })
    }
    persist()
  }

  function removeItem(productId, size) {
    items.value = items.value.filter(
      (i) => !(i.productId === productId && i.size === size)
    )
    persist()
  }

  function updateQuantity(productId, size, quantity) {
    const item = items.value.find(
      (i) => i.productId === productId && i.size === size
    )
    if (item) {
      item.quantity = Math.max(1, quantity)
      persist()
    }
  }

  function clear() {
    items.value = []
    persist()
  }

  async function checkout(shipping, payment) {
    const orderItems = items.value.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      size: i.size,
    }))
    const order = await createOrder({ items: orderItems, shipping, payment })
    clear()
    return order
  }

  return {
    items,
    count,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    checkout,
  }
})
