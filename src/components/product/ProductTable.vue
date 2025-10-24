<template>
  <el-table
    v-loading="loading"
    :data="products"
    style="width: 100%"
    row-key="id"
    :expand-row-keys="expandedRows"
    @expand-change="handleExpandChange"
  >
    <!-- Expand column for SKU details -->
    <el-table-column type="expand">
      <template #default="{ row }">
        <div class="expand-content">
          <h4 class="expand-title">
            SKU Details
          </h4>
          <el-table 
            :data="row.skus" 
            class="sku-table"
          >
            <el-table-column
              prop="skuCode" 
              label="SKU Code" 
              width="180" 
            />
            <el-table-column
              prop="unit"
              label="Unit"
              width="100"
            />
            <el-table-column
              label="Specifications"
              min-width="200"
            >
              <template #default="{ row: sku }">
                <el-tag
                  v-for="(value, key) in sku.specs"
                  :key="key"
                  size="small"
                  class="spec-tag"
                >
                  {{ key }}: {{ value }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="Price"
              width="120"
            >
              <template #default="{ row: sku }">
                <span class="price">${{ sku.price.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="Stock"
              width="120"
            >
              <template #default="{ row: sku }">
                <el-tag
                  :type="getStockType(sku.stock)"
                  size="small"
                >
                  {{ sku.stock }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="Status"
              width="100"
            >
              <template #default="{ row: sku }">
                <el-tag
                  :type="sku.status === 'active' ? 'success' : 'info'"
                  size="small"
                >
                  {{ sku.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </el-table-column>

    <!-- Product Name -->
    <el-table-column
      prop="name"
      label="Product Name"
      min-width="200"
    />

    <!-- Category -->
    <el-table-column
      prop="category"
      label="Category"
      width="150"
    >
      <template #default="{ row }">
        <el-tag
          type="primary"
          size="small"
        >
          {{ row.category }}
        </el-tag>
      </template>
    </el-table-column>

    <!-- SKU Count -->
    <el-table-column
      label="SKUs"
      width="80"
      align="center"
    >
      <template #default="{ row }">
        <el-badge
          :value="row.skus.length"
          class="sku-badge"
        />
      </template>
    </el-table-column>

    <!-- Price Range -->
    <el-table-column
      label="Price Range"
      width="150"
    >
      <template #default="{ row }">
        <span class="price-range">{{ getPriceRange(row) }}</span>
      </template>
    </el-table-column>

    <!-- Total Stock -->
    <el-table-column
      label="Total Stock"
      width="120"
      align="center"
    >
      <template #default="{ row }">
        <span class="stock-total">{{ getTotalStock(row) }}</span>
      </template>
    </el-table-column>

    <!-- Status -->
    <el-table-column
      label="Status"
      width="100"
    >
      <template #default="{ row }">
        <el-tag
          :type="row.status === 'active' ? 'success' : 'info'"
          size="small"
        >
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>

    <!-- Actions -->
    <el-table-column
      label="Actions"
      width="200"
      fixed="right"
    >
      <template #default="{ row }">
        <el-button
          type="primary"
          size="small"
          @click="$emit('view', row)"
        >
          <el-icon><View /></el-icon>
          <span style="margin-left: 0.25rem">View</span>
        </el-button>
        <el-button
          type="warning"
          size="small"
          @click="$emit('edit', row)"
        >
          <el-icon><Edit /></el-icon>
          <span style="margin-left: 0.25rem">Edit</span>
        </el-button>
        <el-button
          type="danger"
          size="small"
          @click="$emit('delete', row)"
        >
          <el-icon><Delete /></el-icon>
          <span style="margin-left: 0.25rem">Delete</span>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { View, Edit, Delete } from '@element-plus/icons-vue'
import type { Product } from '@/types/product'

// Props
defineProps<{
  products: Product[]
  loading?: boolean
}>()

// Emits
defineEmits<{
  view: [product: Product]
  edit: [product: Product]
  delete: [product: Product]
}>()

// State for expanded rows
const expandedRows = ref<string[]>([])

// Handle row expansion
const handleExpandChange = (_row: Product, expandedRowsData: Product[]) => {
  expandedRows.value = expandedRowsData.map((r) => r.id)
}

// Calculate price range for a product
const getPriceRange = (product: Product): string => {
  if (product.skus.length === 0) return 'N/A'
  
  const prices = product.skus.map((sku) => sku.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  
  if (min === max) return `$${min.toFixed(2)}`
  return `$${min.toFixed(2)} - $${max.toFixed(2)}`
}

// Calculate total stock for a product
const getTotalStock = (product: Product): number => {
  return product.skus.reduce((sum, sku) => sum + sku.stock, 0)
}

// Get stock level type for color coding
const getStockType = (stock: number): 'success' | 'warning' | 'danger' => {
  if (stock > 100) return 'success'
  if (stock > 20) return 'warning'
  return 'danger'
}
</script>

<style scoped>
.expand-content {
  padding: 1rem 3rem;
  background: #f8f9fa;
}

.expand-title {
  margin-bottom: 1rem;
  color: #667eea;
  font-size: 1.1rem;
}

.sku-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.spec-tag {
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
}

.price {
  font-weight: 600;
  color: #667eea;
}

.price-range {
  font-weight: 500;
  color: #667eea;
}

.stock-total {
  font-weight: 600;
}

.sku-badge {
  cursor: pointer;
}
</style>
