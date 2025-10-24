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
              <el-dropdown-item @click="handleExport">Export</el-dropdown-item>
              <el-dropdown-item @click="handleImport">Import</el-dropdown-item>
              <el-dropdown-item divided @click="handleBulkDelete">Bulk Delete</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- Added selection info and pagination -->
    <div v-if="selectedProducts.length > 0" class="selection-info">
      <el-alert type="info" :closable="false">
        <template #title>
          {{ selectedProducts.length }} product(s) selected
        </template>
      </el-alert>
    </div>

    <!-- Product Table -->
    <ProductTable
      :products="paginatedProducts"
      :loading="loading"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @selection-change="handleSelectionChange"
    />

    <!-- Added pagination -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="filteredProducts.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

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
import { ref, computed, onMounted } from 'vue'
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
const selectedProducts = ref<Product[]>([])
const formMode = ref<'add' | 'edit'>('add')

const currentPage = ref(1)
const pageSize = ref(20)

// Initialize store on mount
onMounted(async () => {
  loading.value = true
  await productStore.initialize()
  loading.value = false
})

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

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
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

    await productStore.deleteProduct(product.id)
    ElMessage.success('Product deleted successfully')
  } catch (error) {
    // User cancelled or error occurred
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete product')
    }
  }
}

const handleFormSubmit = async (product: Product) => {
  try {
    if (formMode.value === 'add') {
      await productStore.addProduct(product)
      ElMessage.success('Product added successfully')
    } else {
      await productStore.updateProduct(product.id, product)
      ElMessage.success('Product updated successfully')
    }
    showFormModal.value = false
  } catch (error) {
    ElMessage.error(`Failed to ${formMode.value} product`)
  }
}

const handleSelectionChange = (products: Product[]) => {
  selectedProducts.value = products
}

const handleClear = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
  ElMessage.info('Filters cleared')
}

const handleRefresh = async () => {
  loading.value = true
  try {
    await productStore.initialize()
    ElMessage.success('Data refreshed')
  } catch (error) {
    ElMessage.error('Failed to refresh data')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

const handleExport = () => {
  ElMessage.info('Export functionality coming soon')
}

const handleImport = () => {
  ElMessage.info('Import functionality coming soon')
}

const handleBulkDelete = async () => {
  if (selectedProducts.value.length === 0) {
    ElMessage.warning('Please select products to delete')
    return
  }

  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete ${selectedProducts.value.length} product(s)? This action cannot be undone.`,
      'Confirm Bulk Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    for (const product of selectedProducts.value) {
      await productStore.deleteProduct(product.id)
    }

    selectedProducts.value = []
    ElMessage.success('Products deleted successfully')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete products')
    }
  }
}
</script>

<style scoped>
.product-management {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

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

/* Added selection info styles */
.selection-info {
  margin-bottom: 1rem;
}

/* Added pagination styles */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
</style>
