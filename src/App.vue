<script setup>
import Navbar from "./components/Navbar.vue"
import Footer from "./components/Footer.vue"
</script>

<template>
  <div class="app-wrapper">
    <Navbar />
    <main class="app-main">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
}
</style>
