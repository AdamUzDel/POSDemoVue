import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import DashboardLayout from "@/layouts/DashboardLayout.vue"

// Define application routes
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/Home.vue"),
        meta: { title: "Home" },
      },
      {
        path: "search",
        name: "Search",
        component: () => import("@/views/Search.vue"),
        meta: { title: "Search" },
      },
      // Inventory Module Routes
      {
        path: "inventory/products",
        name: "Products",
        component: () => import("@/views/ProductManagement.vue"),
        meta: { title: "Product List" },
      },
      {
        path: "inventory/orders",
        name: "Orders",
        component: () => import("@/views/Orders.vue"),
        meta: { title: "Orders" },
      },
      {
        path: "inventory/suppliers",
        name: "Suppliers",
        component: () => import("@/views/Suppliers.vue"),
        meta: { title: "Suppliers" },
      },
      {
        path: "inventory/stock",
        name: "StockManagement",
        component: () => import("@/views/StockManagement.vue"),
        meta: { title: "Stock Management" },
      },
      // Sales Module Routes
      {
        path: "sales/pos",
        name: "POS",
        component: () => import("@/views/POS.vue"),
        meta: { title: "Point of Sale" },
      },
      {
        path: "sales/transactions",
        name: "Transactions",
        component: () => import("@/views/Transactions.vue"),
        meta: { title: "Transactions" },
      },
      // Other Routes
      {
        path: "reports",
        name: "Reports",
        component: () => import("@/views/Reports.vue"),
        meta: { title: "Reports" },
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("@/views/Settings.vue"),
        meta: { title: "Settings" },
      },
    ],
  },
]

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard to update page title
router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || "Product Management System"
  next()
})

export default router
