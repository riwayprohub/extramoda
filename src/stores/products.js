import { defineStore } from "pinia"
import { ref } from "vue"
import * as productsApi from "../api/products.js"
import { demoItems, demoCategories } from "../data/demoData.js"

function filterDemo(params = {}) {
  let list = [...demoItems]
  if (params.category) list = list.filter((i) => i.category === params.category)
  if (params.badge) list = list.filter((i) => i.badge === params.badge)
  if (params.featured) list = list.filter((i) => i.featured)
  if (params.search) {
    const s = String(params.search).toLowerCase()
    list = list.filter(
      (i) =>
        i.name.toLowerCase().includes(s) || i.code.toLowerCase().includes(s)
    )
  }
  const page = Number(params.page || 1)
  const pageSize = Number(params.pageSize || 12)
  const start = (page - 1) * pageSize
  return list.slice(start, start + pageSize)
}

export const useProductsStore = defineStore("products", () => {
  const products = ref([])
  const categories = ref([])
  const loading = ref(false)
  const totalPages = ref(1)
  const page = ref(1)
  const isDemo = ref(false)

  async function fetchProducts(params = {}) {
    loading.value = true
    try {
      const res = await productsApi.getProducts({ page: page.value, ...params })
      // Backend respondió: usar datos reales de la API
      isDemo.value = false
      products.value = res.data.items
      totalPages.value = res.data.pagination.totalPages
      return
    } catch {
      // Backend no disponible → usar datos demo para que la página se vea
      isDemo.value = true
      const list = filterDemo({ page: page.value, ...params })
      products.value = list
      const pageSize = Number(params.pageSize || 12)
      totalPages.value = Math.max(1, Math.ceil(demoItems.length / pageSize))
      return
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const res = await productsApi.getCategories()
      categories.value = res.data.categories.map((c) => c.category)
    } catch {
      categories.value = [...demoCategories]
    }
  }

  async function fetchAllByBadge(badge) {
    try {
      const res = await productsApi.getProducts({ badge, pageSize: 8 })
      return res.data.items
    } catch {
      return demoItems.filter((i) => i.badge === badge)
    }
  }

  async function fetchLatest() {
    try {
      const res = await productsApi.getProducts({ pageSize: 8 })
      return res.data.items
    } catch {
      return [...demoItems].sort((a, b) => b.id - a.id)
    }
  }

  return {
    products,
    categories,
    loading,
    totalPages,
    page,
    isDemo,
    fetchProducts,
    fetchCategories,
    fetchAllByBadge,
    fetchLatest,
  }
})
