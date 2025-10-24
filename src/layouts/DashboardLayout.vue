<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <!-- Added iGourd logo with conditional rendering based on collapse state -->
        <div v-if="!sidebarCollapsed" class="logo-container">
          <img src="/logo.svg" alt="iGourd POS" class="logo-image" />
        </div>
        <div v-else class="logo-container-collapsed">
          <img src="/logo.svg" alt="iGourd" class="logo-icon" />
        </div>
      </div>

      <!-- Added toggle button that's always visible, positioned absolutely -->
      <el-button
        text
        :icon="sidebarCollapsed ? Expand : Fold"
        @click="toggleSidebar"
        class="collapse-btn"
        :class="{ 'collapsed-state': sidebarCollapsed }"
      />

      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        :collapse="sidebarCollapsed"
        @select="handleMenuSelect"
      >
        <!-- Search -->
        <el-menu-item index="/search">
          <el-icon><Search /></el-icon>
          <span>Search</span>
        </el-menu-item>

        <!-- Home -->
        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <span>Home</span>
        </el-menu-item>

        <!-- Inventory (with submenu) -->
        <el-sub-menu index="inventory">
          <template #title>
            <el-icon><Box /></el-icon>
            <span>Inventory</span>
          </template>
          <el-menu-item index="/inventory/products">Products</el-menu-item>
          <el-menu-item index="/inventory/orders">Orders</el-menu-item>
          <el-menu-item index="/inventory/suppliers">Suppliers</el-menu-item>
          <el-menu-item index="/inventory/stock">Stock Management</el-menu-item>
        </el-sub-menu>

        <!-- Sales -->
        <el-sub-menu index="sales">
          <template #title>
            <el-icon><ShoppingCart /></el-icon>
            <span>Sales</span>
          </template>
          <el-menu-item index="/sales/pos">POS</el-menu-item>
          <el-menu-item index="/sales/transactions">Transactions</el-menu-item>
        </el-sub-menu>

        <!-- Reports -->
        <el-menu-item index="/reports">
          <el-icon><DataAnalysis /></el-icon>
          <span>Reports</span>
        </el-menu-item>

        <!-- Settings -->
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>Settings</span>
        </el-menu-item>
      </el-menu>
    </aside>

    <!-- Main Content Area -->
    <div class="main-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-left">
          <!-- Breadcrumb Navigation -->
          <el-breadcrumb separator="›" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="(crumb, index) in breadcrumbs"
              :key="index"
              :to="crumb.path ? { path: crumb.path } : undefined"
            >
              {{ crumb.label }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <!-- Date and Time -->
          <span class="datetime">{{ currentDateTime }}</span>

          <!-- User Info -->
          <el-dropdown class="user-dropdown">
            <div class="user-info">
              <el-icon class="user-icon"><Star /></el-icon>
              <el-avatar :size="32" class="user-avatar">
                <User />
              </el-avatar>
              <div class="user-details">
                <span class="store-name">Store Short Name</span>
                <span class="user-role">+86 17342677545/General Manager</span>
              </div>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Profile</el-dropdown-item>
                <el-dropdown-item>Settings</el-dropdown-item>
                <el-dropdown-item divided>Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- Page Content -->
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Fold, Expand, Search, HomeFilled, Box, ShoppingCart, DataAnalysis, Setting, Star, ArrowDown, User } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// Sidebar state
const sidebarCollapsed = ref(false)

// Active menu item based on current route
const activeMenu = computed(() => route.path)

// Breadcrumbs based on current route
const breadcrumbs = computed(() => {
  const crumbs: Array<{ label: string; path?: string }> = []
  
  if (route.path.startsWith('/inventory')) {
    crumbs.push({ label: 'Inventory' })
    if (route.path.includes('products')) {
      crumbs.push({ label: 'Product List' })
    } else if (route.path.includes('orders')) {
      crumbs.push({ label: 'Orders' })
    } else if (route.path.includes('suppliers')) {
      crumbs.push({ label: 'Suppliers' })
    } else if (route.path.includes('stock')) {
      crumbs.push({ label: 'Stock Management' })
    }
  } else if (route.path === '/home') {
    // No additional breadcrumbs for home
  } else if (route.path === '/reports') {
    crumbs.push({ label: 'Reports' })
  } else if (route.path === '/settings') {
    crumbs.push({ label: 'Settings' })
  }
  
  return crumbs
})

// Current date and time
const currentDateTime = ref('')

const updateDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentDateTime.value = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`
}

let dateTimeInterval: number | null = null

onMounted(() => {
  updateDateTime()
  dateTimeInterval = window.setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  if (dateTimeInterval) {
    clearInterval(dateTimeInterval)
  }
})

// Toggle sidebar collapse
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Handle menu selection
const handleMenuSelect = (index: string) => {
  router.push(index)
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

/* Sidebar Styles */
.sidebar {
  width: 240px;
  background-color: #374151;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
  position: relative;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 80px;
}

/* Logo styling for expanded and collapsed states */
.logo-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-image {
  width: 180px;
  height: auto;
  object-fit: contain;
}

.logo-container-collapsed {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

/* Toggle button positioned absolutely to always be visible */
.collapse-btn {
  position: absolute;
  top: 90px;
  right: 8px;
  color: #fff;
  z-index: 10;
  background-color: rgba(59, 130, 246, 0.8);
  border-radius: 4px;
  padding: 8px;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background-color: rgba(59, 130, 246, 1);
  color: #111827;
}

.collapse-btn.collapsed-state {
  top: 70px;
  right: 50%;
  transform: translateX(50%);
}

.sidebar-menu {
  flex: 1;
  border: none;
  background-color: transparent;
  margin-top: 20px;
}

.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s;
}

.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sidebar-menu :deep(.el-menu-item.is-active),
.sidebar-menu :deep(.el-sub-menu .el-menu-item.is-active) {
  background-color: #3b82f6;
  color: #fff;
}

.sidebar-menu :deep(.el-sub-menu .el-menu-item) {
  background-color: #374151;
  min-width: 0;
}

/* Main Container */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header Styles */
.dashboard-header {
  height: 64px;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.header-left {
  flex: 1;
}

.breadcrumb {
  font-size: 14px;
}

.breadcrumb :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #3b82f6;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.datetime {
  font-size: 14px;
  color: #6b7280;
}

.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-icon {
  color: #fbbf24;
  font-size: 20px;
}

.user-avatar {
  background-color: #3b82f6;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.store-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.user-role {
  font-size: 12px;
  color: #6b7280;
}

/* Content Area */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: #f5f7fa;
}
</style>
