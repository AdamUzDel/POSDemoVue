<template>
  <el-table
    :data="products"
    v-loading="loading"
    stripe
    style="width: 100%"
    row-key="id"
    :expand-row-keys="expandedRows"
    @expand-change="handleExpandChange"
    @selection-change="handleSelectionChange"
  >
    <!-- Selection column for row selection -->
    <el-table-column type="selection" width="55" />

    <!-- Expand column for SKU details -->
    <el-table-column type="expand">
      <template #default="{ row }">
        <div class="expand-content">
          <h4 class="expand-title">SKU Details</h4>
          <el-table :data="row.skus" class="sku-table">
            <el-table-column prop="skuCode" label="SKU Code" width="180" />
            <el-table-column prop="unit" label="Unit" width="150" />
            <el-table-column label="Specifications" min-width="200">
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
            <el-table-column label="Price" width="120">
              <template #default="{ row: sku }">
                <span class="price">${{ sku.price.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Stock" width="120">
              <template #default="{ row: sku }">
                <el-tag :type="getStockType(sku.stock)" size="small">
                  {{ sku.stock }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Status" width="100">
              <template #default="{ row: sku }">
                <el-tag :type="sku.status === 'active' ? 'success' : 'info'" size="small">
                  {{ sku.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </el-table-column>

    <!-- Product Name with filter -->
    <el-table-column
      prop="name"
      label="Product Name"
      min-width="200"
      :filters="nameFilters"
      :filter-method="filterHandler"
      filter-placement="bottom-end"
    />

    <!-- Category with filter -->
    <el-table-column
      prop="category"
      label="Category"
      width="150"
      :filters="categoryFilters"
      :filter-method="filterHandler"
      filter-placement="bottom-end"
    >
      <template #default="{ row }">
        <el-tag type="primary" size="small">{{ row.category }}</el-tag>
      </template>
    </el-table-column>

    <!-- SKU Count -->
    <el-table-column label="SKUs" width="80" align="center">
      <template #default="{ row }">
        <el-badge :value="row.skus.length" class="sku-badge" />
      </template>
    </el-table-column>

    <!-- Price Range -->
    <el-table-column label="Price Range" width="150">
      <template #default="{ row }">
        <span class="price-range">{{ getPriceRange(row) }}</span>
      </template>
    </el-table-column>

    <!-- Total Stock -->
    <el-table-column label="Total Stock" width="120" align="center">
      <template #default="{ row }">
        <span class="stock-total">{{ getTotalStock(row) }}</span>
      </template>
    </el-table-column>

    <!-- Status with filter -->
    <el-table-column
      prop="status"
      label="Status"
      width="100"
      :filters="[
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ]"
      :filter-method="filterHandler"
      filter-placement="bottom-end"
    >
      <template #default="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>

    <!-- Actions with responsive design -->
    <el-table-column label="Actions" width="200" fixed="right">
      <template #default="{ row }">
        <div class="action-buttons">
          <!-- Show all buttons on larger screens -->
          <div class="action-buttons-full">
            <el-button
              type="primary"
              size="small"
              @click="$emit('view', row)"
            >
              View
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="$emit('edit', row)"
            >
              Edit
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="$emit('delete', row)"
            >
              Delete
            </el-button>
          </div>

          <!-- Show icon buttons + dropdown on smaller screens -->
          <div class="action-buttons-compact">
            <el-button
              type="primary"
              size="small"
              circle
              @click="$emit('view', row)"
            >
              <el-icon><View /></el-icon>
            </el-button>
            <el-button
              type="warning"
              size="small"
              circle
              @click="$emit('edit', row)"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-dropdown @command="(cmd) => handleDropdownCommand(cmd, row)">
              <el-button type="info" size="small" circle>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="delete">
                    <el-icon><Delete /></el-icon>
                    Delete
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { View, Edit, Delete, MoreFilled } from '@element-plus/icons-vue'
import type { Product } from '@/types/product'

// Props
const props = defineProps<{
  products: Product[]
  loading?: boolean
}>()

// Emits
const emit = defineEmits<{
  view: [product: Product]
  edit: [product: Product]
  delete: [product: Product]
  selectionChange: [products: Product[]]
}>()

// State for expanded rows
const expandedRows = ref<string[]>([])

// State for selected rows
const selectedRows = ref<Product[]>([])

// Generate filters for product names
const nameFilters = computed(() => {
  const names = new Set(props.products.map((p) => p.name))
  return Array.from(names).map((name) => ({ text: name, value: name }))
})

// Generate filters for categories
const categoryFilters = computed(() => {
  const categories = new Set(props.products.map((p) => p.category))
  return Array.from(categories).map((cat) => ({ text: cat, value: cat }))
})

// Handle row expansion
const handleExpandChange = (row: Product, expandedRowsData: Product[]) => {
  expandedRows.value = expandedRowsData.map((r) => r.id)
}

// Handle selection change
const handleSelectionChange = (selection: Product[]) => {
  selectedRows.value = selection
  emit('selectionChange', selection)
}

// Filter handler for table columns
const filterHandler = (
  value: string,
  row: Product,
  column: { property: string }
) => {
  const property = column.property
  return row[property as keyof Product] === value
}

// Handle dropdown command
const handleDropdownCommand = (command: string, row: Product) => {
  if (command === 'delete') {
    emit('delete', row)
  }
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
  color: #3b82f6;
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
  color: #3b82f6;
}

.price-range {
  font-weight: 500;
  color: #3b82f6;
}

.stock-total {
  font-weight: 600;
}

.sku-badge {
  cursor: pointer;
}

/* Responsive action buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-buttons-full {
  display: flex;
  gap: 0.5rem;
}

.action-buttons-compact {
  display: none;
  gap: 0.5rem;
}

/* Show compact buttons on smaller screens */
@media (max-width: 1400px) {
  .action-buttons-full {
    display: none;
  }

  .action-buttons-compact {
    display: flex;
  }
}
</style>
