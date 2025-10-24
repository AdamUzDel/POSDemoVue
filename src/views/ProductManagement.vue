<template>
  <div class="product-management">
    <!-- Toolbar: Search and Actions -->
    <div class="toolbar">
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="Search products, SKU, or category..."
          clearable
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="selectedCategory"
          placeholder="All Categories"
          clearable
          class="category-select"
        >
          <el-option label="All Categories" value="" />
          <el-option
            v-for="cat in categories"
            :key="cat"
            :label="cat"
            :value="cat"
          />
        </el-select>
        <!-- Added Clear and Refresh buttons to match screenshot -->
        <el-button @click="handleClear">
          <el-icon><Close /></el-icon>
          Clear
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>
      <div class="action-buttons">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          Add
        </el-button>
        <el-dropdown trigger="click">
          <el-button>
            Action
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Export</el-dropdown-item>
              <el-dropdown-item>Import</el-dropdown-item>
              <el-dropdown-item divided>Bulk Delete</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- Product Table -->
    <ProductTable
      :products="filteredProducts"
      :loading="loading"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Add/Edit Product Modal -->
    <ProductFormModal
      v-model="showFormModal"
      :product="selectedProduct"
      :mode="formMode"
      @submit="handleFormSubmit"
    />

    <!-- Product Details Modal -->
    <ProductDetailsModal
      v-model="showDetailsModal"
      :product="selectedProduct"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Close, Refresh, ArrowDown } from '@element-plus/icons-vue'
import { useProductStore } from '@/stores/productStore'
import ProductTable from '@/components/product/ProductTable.vue'
import ProductFormModal from '@/components/product/ProductFormModal.vue'
import ProductDetailsModal from '@/components/product/ProductDetailsModal.vue'
import type { Product } from '@/types/product'

// Store
const productStore = useProductStore()

// State
const searchQuery = ref('')
const selectedCategory = ref('')
const loading = ref(false)
const showFormModal = ref(false)
const showDetailsModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const formMode = ref<'add' | 'edit'>('add')

// Computed
const categories = computed(() => productStore.categories)
const filteredProducts = computed(() => {
  let result = productStore.products

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.skus.some((sku) => sku.skuCode.toLowerCase().includes(query))
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    result = result.filter((p) => p.category === selectedCategory.value)
  }

  return result
})

// Handlers
const handleAdd = () => {
  selectedProduct.value = null
  formMode.value = 'add'
  showFormModal.value = true
}

const handleView = (product: Product) => {
  selectedProduct.value = product
  showDetailsModal.value = true
}

const handleEdit = (product: Product) => {
  selectedProduct.value = product
  formMode.value = 'edit'
  showFormModal.value = true
}

const handleDelete = async (product: Product) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    productStore.deleteProduct(product.id)
    ElMessage.success('Product deleted successfully')
  } catch {
    // User cancelled
  }
}

const handleFormSubmit = (product: Product) => {
  if (formMode.value === 'add') {
    productStore.addProduct(product)
    ElMessage.success('Product added successfully')
  } else {
    productStore.updateProduct(product.id, product)
    ElMessage.success('Product updated successfully')
  }
  showFormModal.value = false
}

const handleClear = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  ElMessage.info('Filters cleared')
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('Data refreshed')
  }, 500)
}
</script>

<style scoped>
.product-management {
  /* Removed padding and background, now handled by dashboard layout */
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Removed header styles as they're now in the dashboard header */

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-section {
  display: flex;
  gap: 0.75rem;
  flex: 1;
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.category-select {
  width: 200px;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}
</style>
