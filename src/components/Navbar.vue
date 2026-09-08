<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import { useAuthStore } from "../stores/auth.js"

const router = useRouter()
const auth = useAuthStore()
const { isAuthenticated, user, isAdmin } = storeToRefs(auth)
const mobileOpen = ref(false)
const shopOpen = ref(false)

function onLogout() {
  auth.logout()
  router.push({ name: "home" })
}

onMounted(() => {
  if (isAuthenticated.value && !user.value) {
    auth.fetchMe()
  }
})
</script>

<template>
  <header class="navbar">
    <div class="container navbar-inner">
      <RouterLink :to="{ name: 'home' }" class="navbar-brand">EXTRA MODA</RouterLink>

      <nav class="navbar-links" :class="{ open: mobileOpen }">
        <RouterLink :to="{ name: 'home' }">HOME</RouterLink>

        <div class="dropdown" @mouseenter="shopOpen = true" @mouseleave="shopOpen = false">
          <RouterLink :to="{ name: 'shop' }">CATÁLOGO</RouterLink>
          <div v-if="shopOpen" class="dropdown-menu">
            <RouterLink :to="{ name: 'shop', query: { category: 'Pantalones' } }">Pantalones</RouterLink>
            <RouterLink :to="{ name: 'shop', query: { category: 'Polleras' } }">Polleras</RouterLink>
            <RouterLink :to="{ name: 'shop', query: { category: 'Shorts' } }">Shorts</RouterLink>
            <RouterLink :to="{ name: 'shop', query: { category: 'Partes de arriba' } }">Partes de arriba</RouterLink>
          </div>
        </div>

        <RouterLink :to="{ name: 'shop', query: { badge: 'new' } }">NEW IN</RouterLink>
        <RouterLink :to="{ name: 'shop', query: { badge: 'oferta' } }">OFERTAS</RouterLink>
        <RouterLink :to="{ name: 'faq' }">FAQ</RouterLink>
      </nav>

      <div class="navbar-actions">
        <RouterLink v-if="isAdmin" :to="{ name: 'admin-upload' }" class="admin-link">Subir catálogo</RouterLink>
        <template v-if="!isAuthenticated">
          <RouterLink :to="{ name: 'login' }" class="login-link">Acceder</RouterLink>
        </template>
        <template v-else>
          <button class="logout-btn" @click="onLogout">Salir</button>
        </template>
        <button class="navbar-toggle" @click="mobileOpen = !mobileOpen">☰</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.navbar-brand {
  font-weight: 800;
  font-size: 1.4rem;
  letter-spacing: 1px;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar-links a {
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.navbar-links .router-link-exact-active {
  color: var(--color-accent);
  font-weight: 700;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-width: 180px;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
}

.dropdown-menu a {
  padding: 0.5rem 1rem;
  text-transform: none;
}

.dropdown-menu a:hover {
  background: #f7f7f7;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-link {
  background: var(--color-accent);
  color: #fff !important;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.login-link {
  font-size: 0.85rem;
  font-weight: 500;
}

.logout-btn {
  background: none;
  color: #333;
  padding: 0;
  font-size: 0.85rem;
}

.navbar-toggle {
  display: none;
  background: none;
  color: #111;
  font-size: 1.4rem;
}

@media (max-width: 820px) {
  .navbar-toggle {
    display: block;
  }

  .navbar-links {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: #fff;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    border-bottom: 1px solid #eee;
    display: none;
    gap: 0.8rem;
  }

  .navbar-links.open {
    display: flex;
  }

  .dropdown-menu {
    position: static;
    box-shadow: none;
    border: none;
    padding: 0.3rem 0 0 1rem;
  }
}
</style>
