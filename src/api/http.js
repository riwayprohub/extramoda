import axios from "axios"

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Si se envía FormData (subida de archivos), no forzar JSON
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]
  }
  return config
})

http.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || err.message || "Error de red"
    return Promise.reject(new Error(message))
  }
)

export default http
