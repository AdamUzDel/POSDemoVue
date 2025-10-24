<template>
  <div class="home-page">
    <el-card class="welcome-card">
      <h1>Welcome to igourd POS System</h1>
      <p>Select a module from the sidebar to get started</p>
    </el-card>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#3b82f6"><Box /></el-icon>
            <div class="stat-info">
              <h3>Products</h3>
              <p class="stat-number">{{ productCount }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#10b981"><ShoppingCart /></el-icon>
            <div class="stat-info">
              <h3>Orders</h3>
              <p class="stat-number">0</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#f59e0b"><DataAnalysis /></el-icon>
            <div class="stat-info">
              <h3>Revenue</h3>
              <p class="stat-number">$0</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#ef4444"><User /></el-icon>
            <div class="stat-info">
              <h3>Customers</h3>
              <p class="stat-number">0</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Box, ShoppingCart, DataAnalysis, User } from '@element-plus/icons-vue'
import { useProductStore } from '@/stores/productStore'

const productStore = useProductStore()
const productCount = computed(() => productStore.products.length)
</script>

<style scoped>
.home-page {
  padding: 1rem;
}

.welcome-card {
  margin-bottom: 2rem;
  text-align: center;
  padding: 2rem;
}

.welcome-card h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #111827;
}

.welcome-card p {
  font-size: 1.1rem;
  color: #6b7280;
}

.stats-row {
  margin-bottom: 2rem;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-info h3 {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}
</style>
