import http from "./http.js"

export const createOrder = (data) => http.post("/orders", data)
export const getMyOrders = () => http.get("/orders/mine")
export const getOrders = () => http.get("/orders")
export const updateOrderStatus = (id, status) =>
  http.put(`/orders/${id}/status`, { status })
