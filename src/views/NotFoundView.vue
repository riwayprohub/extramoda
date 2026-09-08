<template>
  <div class="container nf">
    <h1>404</h1>
    <p>La página que buscás no existe.</p>
    <RouterLink :to="{ name: 'home' }" class="btn">Volver al inicio</RouterLink>
  </div>
</template>

<style scoped>
.nf {
  text-align: center;
  padding: 5rem 1rem;
}

.nf h1 {
  font-size: 4rem;
}

.nf p {
  color: #777;
  margin-bottom: 1.5rem;
}

.btn {
  background: #111;
  color: #fff;
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  display: inline-block;
}
</style>
