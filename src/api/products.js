import http from "./http.js"

export const getProducts = (params) => http.get("/products", { params })
export const getProduct = (slug) => http.get(`/products/${slug}`)
export const getCategories = () => http.get("/products/categories")
export const createProduct = (data) => http.post("/products", data)
export const updateProduct = (id, data) => http.put(`/products/${id}`, data)
export const deleteProduct = (id) => http.delete(`/products/${id}`)
