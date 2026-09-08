<script setup>
import { ref, onMounted } from "vue"
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products.js"
import { getHeroImages, uploadHeroImages, deleteHeroImage } from "../api/hero.js"
import { useAuthStore } from "../stores/auth.js"
import { useRouter } from "vue-router"

const router = useRouter()
const auth = useAuthStore()

const items = ref([])
const loading = ref(false)
const uploading = ref(false)
const message = ref("")
const error = ref("")

// Fondo del Home (hero): hasta 3 imágenes
const MAX_HERO_IMAGES = 3
const heroImages = ref([])
const heroFiles = ref([])
const heroPreviews = ref([])
const heroUploading = ref(false)
const heroMessage = ref("")
const heroError = ref("")

// Estado del formulario
const editingId = ref(null)
const form = ref({
  code: "",
  name: "",
  price: "",
  category: "Pantalones",
  badge: "",
  description: "",
  stock: 999,
})
const files = ref([])
const previews = ref([])

const categories = ["Pantalones", "Polleras", "Shorts", "Partes de arriba", "Otros"]

async function loadItems() {
  loading.value = true
  try {
    const res = await getProducts({ pageSize: 100 })
    items.value = res.data.items
  } finally {
    loading.value = false
  }
}

function onFileChange(e) {
  const selected = Array.from(e.target.files)
  files.value = [...files.value, ...selected]
  e.target.value = ""

  for (const file of selected) {
    previews.value.push(URL.createObjectURL(file))
  }
}

function removeFile(index) {
  files.value.splice(index, 1)
  previews.value.splice(index, 1)
}

function resetForm() {
  editingId.value = null
  form.value = {
    code: "",
    name: "",
    price: "",
    category: "Pantalones",
    badge: "",
    description: "",
    stock: 999,
  }
  files.value = []
  previews.value = []
}

function editItem(item) {
  editingId.value = item.id
  form.value = {
    code: item.code || "",
    name: item.name,
    price: String(item.price),
    category: item.category,
    badge: item.badge || "",
    description: item.description || "",
    stock: item.stock,
  }
  files.value = []
  previews.value = []
  window.scrollTo({ top: 0, behavior: "smooth" })
}

async function saveItem() {
  error.value = ""
  message.value = ""

  if (!form.value.name || !form.value.price) {
    error.value = "Nombre y precio son obligatorios"
    return
  }

  const fd = new FormData()
  fd.append("code", form.value.code)
  fd.append("name", form.value.name)
  fd.append("price", form.value.price)
  fd.append("category", form.value.category)
  fd.append("badge", form.value.badge)
  fd.append("description", form.value.description)
  fd.append("stock", String(form.value.stock))

  for (const file of files.value) {
    fd.append("images", file)
  }

  uploading.value = true
  try {
    if (editingId.value) {
      await updateProduct(editingId.value, fd)
      message.value = "Producto actualizado correctamente"
    } else {
      await createProduct(fd)
      message.value = "Producto creado correctamente (fotos subidas)"
    }
    resetForm()
    await loadItems()
  } catch (e) {
    error.value = e.message
  } finally {
    uploading.value = false
  }
}

async function removeItem(id) {
  if (!confirm("¿Seguro que querés eliminar este producto?")) return
  try {
    await deleteProduct(id)
    await loadItems()
    message.value = "Producto eliminado"
  } catch (e) {
    error.value = e.message
  }
}

async function loadHeroImages() {
  try {
    const res = await getHeroImages()
    heroImages.value = res.data.images
  } catch (e) {
    heroError.value = e.message
  }
}

function onHeroFileChange(e) {
  const remaining = MAX_HERO_IMAGES - heroImages.value.length
  const selected = Array.from(e.target.files).slice(0, remaining)
  heroFiles.value = [...heroFiles.value, ...selected]
  e.target.value = ""
  for (const file of selected) {
    heroPreviews.value.push(URL.createObjectURL(file))
  }
}

function removeHeroFile(index) {
  heroFiles.value.splice(index, 1)
  heroPreviews.value.splice(index, 1)
}

async function saveHeroImages() {
  heroError.value = ""
  heroMessage.value = ""
  if (!heroFiles.value.length) {
    heroError.value = "Seleccioná al menos una imagen"
    return
  }
  const fd = new FormData()
  for (const file of heroFiles.value) {
    fd.append("images", file)
  }
  heroUploading.value = true
  try {
    await uploadHeroImages(fd)
    heroMessage.value = "Imágenes del fondo del Home guardadas"
    heroFiles.value = []
    heroPreviews.value = []
    await loadHeroImages()
  } catch (e) {
    heroError.value = e.message
  } finally {
    heroUploading.value = false
  }
}

async function removeHeroImage(id) {
  if (!confirm("¿Seguro que querés eliminar esta imagen del fondo del Home?")) return
  heroError.value = ""
  heroMessage.value = ""
  try {
    await deleteHeroImage(id)
    heroMessage.value = "Imagen eliminada del fondo del Home"
    await loadHeroImages()
  } catch (e) {
    heroError.value = e.message
  }
}

onMounted(() => {
  if (!auth.isAdmin) {
    router.push({ name: "login" })
    return
  }
  loadItems()
  loadHeroImages()
})
</script>

<template>
  <div class="container admin">
    <h1 class="title">Panel de Catálogo</h1>
    <p class="subtitle">Cargá las fotos de tus prendas. Se aceptan formatos JPG, PNG, WEBP, GIF, AVIF, HEIC, BMP, SVG, TIFF.</p>

    <p v-if="message" class="ok-msg">{{ message }}</p>
    <p v-if="error" class="error-msg">{{ error }}</p>

    <!-- Fondo del Home (hero) -->
    <section class="card hero-card">
      <div class="hero-card-head">
        <div>
          <h2>Fondo del Home (banner principal)</h2>
          <p class="subtitle">
            Estas imágenes se muestran en rotación sobre el fondo negro de la página de
            inicio. Máximo <strong>{{ MAX_HERO_IMAGES }}</strong> imágenes.
          </p>
        </div>
        <span class="hero-count">{{ heroImages.length }} / {{ MAX_HERO_IMAGES }}</span>
      </div>

      <p v-if="heroMessage" class="ok-msg">{{ heroMessage }}</p>
      <p v-if="heroError" class="error-msg">{{ heroError }}</p>

      <div v-if="heroImages.length" class="hero-current">
        <div v-for="img in heroImages" :key="img.id" class="hero-current-item">
          <img :src="img.image" alt="Fondo del Home" />
          <button type="button" class="del-btn" @click="removeHeroImage(img.id)">Eliminar</button>
        </div>
      </div>
      <p v-else class="hint">Todavía no hay imágenes cargadas para el fondo del Home.</p>

      <p v-if="heroImages.length >= MAX_HERO_IMAGES" class="hint hero-limit">
        Límite alcanzado. Eliminá una imagen para poder subir otra.
      </p>

      <div v-else class="hero-upload">
        <input
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          @change="onHeroFileChange"
          class="file-input"
        />
        <button
          type="button"
          :disabled="heroUploading || !heroFiles.length"
          @click="saveHeroImages"
        >
          {{ heroUploading ? 'Subiendo...' : 'Subir imagen(es) al fondo del Home' }}
        </button>
      </div>

      <div v-if="heroPreviews.length" class="previews">
        <div v-for="(prev, i) in heroPreviews" :key="i" class="prev-item">
          <img :src="prev" alt="preview" />
          <button type="button" class="remove-btn" @click="removeHeroFile(i)">✕</button>
        </div>
      </div>
    </section>

    <div class="layout">
      <!-- Formulario -->
      <form class="card form" @submit.prevent="saveItem">
        <h2>{{ editingId ? 'Editar producto' : 'Nuevo producto' }}</h2>

        <div class="form-grid">
          <div class="form-group">
            <label>Código</label>
            <input v-model="form.code" placeholder="Ej: JEAN-001" />
          </div>
          <div class="form-group">
            <label>Nombre *</label>
            <input v-model="form.name" placeholder="Nombre del producto" />
          </div>
          <div class="form-group">
            <label>Precio (ARS) *</label>
            <input v-model.number="form.price" type="number" min="0" step="0.01" />
          </div>
          <div class="form-group">
            <label>Categoría</label>
            <select v-model="form.category">
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Etiqueta</label>
            <select v-model="form.badge">
              <option value="">Sin etiqueta</option>
              <option value="new">New In</option>
              <option value="oferta">Oferta</option>
            </select>
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input v-model.number="form.stock" type="number" min="0" />
          </div>
        </div>

        <div class="form-group">
          <label>Descripción</label>
          <textarea v-model="form.description" rows="3" placeholder="Descripción del producto"></textarea>
        </div>

        <div class="form-group">
          <label>Fotos del producto (seleccioná una o varias)</label>
          <input
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            @change="onFileChange"
            class="file-input"
          />
        </div>

        <div v-if="previews.length" class="previews">
          <div v-for="(prev, i) in previews" :key="i" class="prev-item">
            <img :src="prev" alt="preview" />
            <button type="button" class="remove-btn" @click="removeFile(i)">✕</button>
            <span class="fname">{{ files[i]?.name }}</span>
          </div>
        </div>
        <p v-else class="hint">No hay fotos seleccionadas todavía.</p>

        <div class="form-actions">
          <button type="submit" :disabled="uploading">
            {{ uploading ? 'Subiendo...' : editingId ? 'Guardar cambios' : 'Crear producto' }}
          </button>
          <button v-if="editingId" type="button" class="cancel-btn" @click="resetForm">Cancelar edición</button>
        </div>
      </form>

      <!-- Listado -->
      <div class="card list">
        <h2>Productos del catálogo ({{ items.length }})</h2>
        <div v-if="loading" class="loading">Cargando...</div>
        <div v-else-if="items.length === 0" class="loading">Sin productos todavía.</div>
        <div v-else class="list-items">
          <div v-for="item in items" :key="item.id" class="list-item">
            <img :src="item.images?.[0]" class="list-img" :alt="item.name" />
            <div class="list-info">
              <strong>{{ item.name }}</strong>
              <span>{{ item.code }} · {{ item.category }}</span>
              <span class="list-price">Bs. {{ Number(item.price).toFixed(2) }}</span>
              <span v-if="item.badge" class="list-badge">{{ item.badge }}</span>
            </div>
            <div class="list-actions">
              <button class="edit-btn" @click="editItem(item)">Editar</button>
              <button class="del-btn" @click="removeItem(item.id)">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin {
  padding: 2rem 1rem;
}

.title {
  letter-spacing: 1px;
}

.subtitle {
  color: #777;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.ok-msg {
  background: #e6f4ea;
  color: #1a7f37;
  padding: 0.7rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
}

.card h2 {
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
}

.hero-card {
  margin-bottom: 2rem;
}

.hero-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.hero-card-head .subtitle {
  margin-bottom: 0;
}

.hero-count {
  background: #111;
  color: #fff;
  border-radius: 999px;
  padding: 0.25rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
}

.hero-current {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
}

.hero-current-item {
  width: 200px;
  text-align: center;
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
}

.hero-current-item img {
  width: 100%;
  height: 110px;
  object-fit: cover;
}

.hero-current-item .del-btn {
  width: 100%;
  border-radius: 0;
}

.hero-limit {
  color: #b12704;
  font-weight: 600;
}

.hero-upload {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 0.6rem;
}

.hero-upload .file-input {
  flex: 1;
  min-width: 220px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 600;
  font-size: 0.85rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.file-input {
  padding: 0.5rem;
  border: 1px dashed #bbb;
  border-radius: 4px;
  width: 100%;
}

.previews {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.prev-item {
  position: relative;
  width: 90px;
}

.prev-item img {
  width: 90px;
  height: 110px;
  object-fit: cover;
  border-radius: 4px;
}

.remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #e63946;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
  line-height: 1;
  padding: 0;
}

.fname {
  display: block;
  font-size: 0.6rem;
  color: #777;
  word-break: break-all;
  margin-top: 0.2rem;
}

.hint {
  color: #999;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  background: #eee;
  color: #333;
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-height: 600px;
  overflow-y: auto;
}

.list-item {
  display: flex;
  gap: 1rem;
  align-items: center;
  border: 1px solid #f0f0f0;
  padding: 0.7rem;
  border-radius: 6px;
}

.list-img {
  width: 55px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
}

.list-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.list-info span {
  font-size: 0.8rem;
  color: #777;
}

.list-price {
  font-weight: 700;
  color: #111 !important;
}

.list-badge {
  align-self: flex-start;
  background: #eee;
  padding: 1px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  font-size: 0.65rem !important;
}

.list-actions {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.edit-btn {
  background: #111;
  font-size: 0.8rem;
  padding: 0.35rem 0.7rem;
}

.del-btn {
  background: #e63946;
  font-size: 0.8rem;
  padding: 0.35rem 0.7rem;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: #999;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
