<script setup>
import { ref } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useAuthStore } from "../stores/auth.js"

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = ref({ email: "", password: "" })
const error = ref("")
const loading = ref(false)

async function onSubmit() {
  error.value = ""
  loading.value = true
  try {
    await auth.login(form.value)
    const redirect = route.query.redirect || (auth.isAdmin ? "/admin/catalogo" : "/")
    router.push(redirect)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container auth">
    <form class="auth-card" @submit.prevent="onSubmit">
      <h1>Acceder</h1>
      <p class="sub">Ingresá para gestionar tu catálogo</p>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" required />
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input v-model="form.password" type="password" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Ingresando...' : 'Ingresar' }}
      </button>

      <p class="switch">
        ¿No tenés cuenta?
        <RouterLink :to="{ name: 'register' }">Registrate</RouterLink>
      </p>
    </form>
  </div>
</template>

<style scoped>
.auth {
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
}

.auth-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.auth-card h1 {
  font-size: 1.5rem;
  margin-bottom: 0.2rem;
}

.sub {
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.switch {
  margin-top: 1.2rem;
  font-size: 0.9rem;
  color: #555;
}

.switch a {
  color: var(--color-accent);
  font-weight: 600;
}
</style>
