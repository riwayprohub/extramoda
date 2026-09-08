<script setup>
import { ref } from "vue"

const email = ref("")
const sent = ref(false)

function subscribe() {
  if (email.value.includes("@")) {
    sent.value = true
    email.value = ""
    setTimeout(() => (sent.value = false), 3000)
  }
}
</script>

<template>
  <footer class="footer">
    <div class="container footer-top">
      <div>
        <h4>Store</h4>
        <p>Calle Madrid, Esquina Suipacha, Tarija.</p>
      </div>

      <div>
        <h4>Horarios</h4>
        <p>Lunes a sábado de 8:30 a 13:30 y 15:00 a 20:30</p>
      </div>

      <div>
        <h4>Información</h4>
        <RouterLink :to="{ name: 'faq' }">Preguntas frecuentes</RouterLink>
      </div>

      <div class="newsletter">
        <h4>¿Querés enterarte antes?</h4>
        <p>Nuevos ingresos, promos y adelantos exclusivos.</p>
        <form @submit.prevent="subscribe">
          <input v-model="email" type="email" placeholder="Tu email" required />
          <button type="submit">Enviar</button>
        </form>
        <p v-if="sent" class="sent">¡Gracias por suscribirte!</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© {{ new Date().getFullYear() }} EXTRA MODA · Todos los derechos reservados</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #111;
  color: #fff;
  margin-top: 3rem;
}

.footer-top {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
  padding: 3rem 1rem;
}

.footer h4 {
  letter-spacing: 1px;
  margin-bottom: 0.8rem;
  font-size: 1rem;
}

.footer p,
.footer a {
  color: #bbb;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.footer a:hover {
  color: #fff;
}

.newsletter input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 0.5rem;
  border: 1px solid #333;
  border-radius: 3px;
  background: #1c1c1c;
  color: #fff;
}

.newsletter button {
  background: #fff;
  color: #111;
  font-weight: 600;
}

.sent {
  color: #7ad07a !important;
  margin-top: 0.4rem;
}

.footer-bottom {
  border-top: 1px solid #222;
  padding: 1.2rem 1rem;
  text-align: center;
  font-size: 0.8rem;
  color: #888;
}
</style>
