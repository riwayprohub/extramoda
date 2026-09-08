import { createRouter, createWebHashHistory } from "vue-router"
import { useAuthStore } from "../stores/auth.js"

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/tienda",
    name: "shop",
    component: () => import("../views/ShopView.vue"),
  },
  {
    path: "/producto/:id",
    name: "product-detail",
    component: () => import("../views/ProductDetailView.vue"),
  },
  {
    path: "/preguntas-frecuentes",
    name: "faq",
    component: () => import("../views/FaqView.vue"),
  },
  {
    path: "/carrito",
    name: "cart",
    component: () => import("../views/CartView.vue"),
  },
  {
    path: "/checkout",
    name: "checkout",
    component: () => import("../views/CheckoutView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/registro",
    name: "register",
    component: () => import("../views/RegisterView.vue"),
  },
  {
    path: "/mis-pedidos",
    name: "my-orders",
    component: () => import("../views/MyOrdersView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/catalogo",
    name: "admin-upload",
    component: () => import("../views/AdminUploadView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFoundView.vue"),
  },
]

const router = createRouter({
  history: createWebHashHistory(), //Cambiado para compatibilidad completa con GitHub Pages
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: "home" }
  }
  return true
})

export default router
