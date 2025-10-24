<template>
  <el-dialog
    v-model="dialogVisible"
    title="Product Details"
    width="800px"
    @close="handleClose"
  >
    <div v-if="product" class="product-details">
      <!-- Basic Information -->
      <div class="detail-section">
        <h3 class="section-title">Basic Information</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Product Name">
            {{ product.name }}
          </el-descriptions-item>
          <el-descriptions-item label="Category">
            <el-tag type="primary">{{ product.category }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Base Unit">
            {{ product.baseUnit }}
          </el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="product.status === 'active' ? 'success' : 'info'">
              {{ product.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Created At">
            {{ product.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="Updated At">
            {{ product.updatedAt }}
          </el-descriptions-item>
          <el-descriptions-item label="Description" :span="2">
            {{ product.description }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- Units -->
      <div class="detail-section">
        <h3 class="section-title">Units</h3>
        <div class="units-grid">
          <div v-for="unit in product.units" :key="unit.id" class="unit-card">
            <div class="unit-name">{{ unit.name }}</div>
            <div class="unit-rate">{{ unit.conversionRate }}× base unit</div>
          </div>
        </div>
      </div>

      <!-- Specifications -->
      <div class="detail-section">
        <h3 class="section-title">Specifications</h3>
        <div class="specs-grid">
          <div v-for="spec in product.specifications" :key="spec.id" class="spec-card">
            <div class="spec-name">{{ spec.name }}</div>
            <div class="spec-values">
              <el-tag
                v-for="value in spec.values"
                :key="value"
                size="small"
                type="info"
              >
                {{ value }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- SKU List -->
      <div class="detail-section">
        <h3 class="section-title">
          SKU List
          <el-tag type="info" size="small">{{ product.skus.length }} SKUs</el-tag>
        </h3>
        <el-table :data="product.skus" border style="width: 100%">
          <el-table-column prop="skuCode" label="SKU Code" width="180" />
          <el-table-column prop="unit" label="Unit" width="100" />
          <el-table-column label="Specifications" min-width="200">
            <template #default="{ row }">
              <el-tag
                v-for="(value, key) in row.specs"
                :key="key"
                size="small"
                style="margin-right: 0.5rem"
              >
                {{ key }}: {{ value }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Price" width="120">
            <template #default="{ row }">
              <span class="price">${{ row.price.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Stock" width="100">
            <template #default="{ row }">
              <el-tag :type="getStockType(row.stock)" size="small">
                {{ row.stock }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Status" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Summary Statistics -->
      <div class="detail-section">
        <h3 class="section-title">Summary</h3>
        <div class="summary-grid">
          <div class="summary-card">
            <div class="summary-label">Total SKUs</div>
            <div class="summary-value">{{ product.skus.length }}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Price Range</div>
            <div class="summary-value">{{ getPriceRange() }}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Total Stock</div>
            <div class="summary-value">{{ getTotalStock() }}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Active SKUs</div>
            <div class="summary-value">{{ getActiveSKUCount() }}</div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button type="primary" @click="handleClose">Close</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types/product'

// Props
const props = defineProps<{
  modelValue: boolean
  product: Product | null
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Dialog visibility
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// Calculate price range
const getPriceRange = (): string => {
  if (!props.product || props.product.skus.length === 0) return 'N/A'
  
  const prices = props.product.skus.map((sku) => sku.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  
  if (min === max) return `$${min.toFixed(2)}`
  return `$${min.toFixed(2)} - $${max.toFixed(2)}`
}

// Calculate total stock
const getTotalStock = (): number => {
  if (!props.product) return 0
  return props.product.skus.reduce((sum, sku) => sum + sku.stock, 0)
}

// Count active SKUs
const getActiveSKUCount = (): number => {
  if (!props.product) return 0
  return props.product.skus.filter((sku) => sku.status === 'active').length
}

// Get stock level type for color coding
const getStockType = (stock: number): 'success' | 'warning' | 'danger' => {
  if (stock > 100) return 'success'
  if (stock > 20) return 'warning'
  return 'danger'
}

// Handle dialog close
const handleClose = () => {
  dialogVisible.value = false
}
</script>

<style scoped>
.product-details {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: #667eea;
  font-size: 1.1rem;
  font-weight: 600;
}

.units-grid,
.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.unit-card,
.spec-card {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.unit-name,
.spec-name {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #303133;
}

.unit-rate {
  color: #909399;
  font-size: 0.9rem;
}

.spec-values {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.price {
  font-weight: 600;
  color: #667eea;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.summary-card {
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  text-align: center;
  color: white;
}

.summary-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.summary-value {
  font-size: 1.8rem;
  font-weight: 700;
}
</style>
