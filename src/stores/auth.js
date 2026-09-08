import { defineStore } from "pinia"
import { ref, computed } from "vue"
import * as authApi from "../api/auth.js"

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null)
  const token = ref(localStorage.getItem("token") || "")
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === "admin")

  async function login(credentials) {
    loading.value = true
    try {
      const res = await authApi.login(credentials)
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem("token", res.data.token)
    } finally {
      loading.value = false
    }
  }

  async function register(data) {
    loading.value = true
    try {
      const res = await authApi.register(data)
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem("token", res.data.token)
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await authApi.getMe()
      user.value = res.data.user
    } catch {
      logout()
    }
  }

  function logout() {
    user.value = null
    token.value = ""
    localStorage.removeItem("token")
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    fetchMe,
    logout,
  }
})
