<template>
  <div class="product-management">
    <!-- Header Section -->
    <div class="header">
      <h1 class="text-2xl font-semibold">Product Management</h1>
      <el-button type="primary" @click="openAddDialog">
        <el-icon><Plus /></el-icon>
        Add Product
      </el-button>
    </div>

    <!-- Search and Filter Section -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="Search products by name, SKU, or category..."
        class="search-input"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <el-select v-model="categoryFilter" placeholder="All Categories" clearable class="filter-select">
        <el-option label="All Categories" value="" />
        <el-option label="Electronics" value="electronics" />
        <el-option label="Clothing" value="clothing" />
        <el-option label="Food" value="food" />
        <el-option label="Books" value="books" />
      </el-select>
    </div>

    <!-- Product Table -->
    <el-table
      :data="filteredProducts"
      style="width: 100%"
      class="product-table"
      row-key="id"
      @expand-change="handleExpandChange"
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="expanded-content">
            <h3 class="text-lg font-semibold mb-4">SKU Details</h3>
            <el-table :data="row.skus" class="sku-table">
              <el-table-column prop="skuCode" label="SKU Code" width="150" />
              <el-table-column prop="specifications" label="Specifications" width="200">
                <template #default="{ row: sku }">
                  <el-tag v-for="(value, key) in sku.specifications" :key="key" class="mr-1 mb-1" size="small">
                    {{ key }}: {{ value }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="Unit" width="100" />
              <el-table-column prop="price" label="Price" width="120">
                <template #default="{ row: sku }">
                  ${{ sku.price.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column prop="stock" label="Stock" width="100">
                <template #default="{ row: sku }">
                  <el-tag :type="sku.stock > 50 ? 'success' : sku.stock > 10 ? 'warning' : 'danger'">
                    {{ sku.stock }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="Status" width="100">
                <template #default="{ row: sku }">
                  <el-tag :type="sku.status === 'active' ? 'success' : 'info'">
                    {{ sku.status }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="name" label="Product Name" min-width="200" />
      <el-table-column prop="category" label="Category" width="120" />
      <el-table-column prop="brand" label="Brand" width="120" />
      <el-table-column label="SKU Count" width="100">
        <template #default="{ row }">
          <el-tag>{{ row.skus.length }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Price Range" width="150">
        <template #default="{ row }">
          ${{ getPriceRange(row).min }} - ${{ getPriceRange(row).max }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="viewProduct(row)">
            <el-icon><View /></el-icon>
          </el-button>
          <el-button size="small" type="primary" @click="editProduct(row)">
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button size="small" type="danger" @click="deleteProduct(row)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Add/Edit Product Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? 'Add Product' : 'Edit Product'"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form :model="productForm" :rules="formRules" ref="productFormRef" label-width="120px">
        <el-form-item label="Product Name" prop="name">
          <el-input v-model="productForm.name" placeholder="Enter product name" />
        </el-form-item>
        
        <el-form-item label="Category" prop="category">
          <el-select v-model="productForm.category" placeholder="Select category" style="width: 100%">
            <el-option label="Electronics" value="electronics" />
            <el-option label="Clothing" value="clothing" />
            <el-option label="Food" value="food" />
            <el-option label="Books" value="books" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Brand" prop="brand">
          <el-input v-model="productForm.brand" placeholder="Enter brand name" />
        </el-form-item>
        
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="productForm.description"
            type="textarea"
            :rows="3"
            placeholder="Enter product description"
          />
        </el-form-item>

        <el-divider content-position="left">Units</el-divider>
        
        <el-form-item label="Units">
          <div class="units-container">
            <el-tag
              v-for="unit in productForm.units"
              :key="unit"
              closable
              @close="removeUnit(unit)"
              class="mr-2 mb-2"
            >
              {{ unit }}
            </el-tag>
            <el-input
              v-if="showUnitInput"
              ref="unitInputRef"
              v-model="newUnit"
              size="small"
              style="width: 100px"
              @keyup.enter="addUnit"
              @blur="addUnit"
            />
            <el-button v-else size="small" @click="showUnitInput = true">
              <el-icon><Plus /></el-icon>
              Add Unit
            </el-button>
          </div>
        </el-form-item>

        <el-divider content-position="left">Specifications</el-divider>
        
        <div v-for="(spec, index) in productForm.specifications" :key="index" class="spec-row">
          <el-form-item :label="`Spec ${index + 1}`" class="spec-item">
            <div class="spec-inputs">
              <el-input
                v-model="spec.name"
                placeholder="Name (e.g., Color)"
                style="width: 150px"
              />
              <el-select
                v-model="spec.values"
                multiple
                filterable
                allow-create
                placeholder="Values (e.g., Red, Blue)"
                style="width: 300px"
              >
              </el-select>
              <el-button type="danger" @click="removeSpecification(index)" circle>
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </el-form-item>
        </div>
        
        <el-form-item>
          <el-button @click="addSpecification">
            <el-icon><Plus /></el-icon>
            Add Specification
          </el-button>
        </el-form-item>

        <el-divider content-position="left">SKU Preview</el-divider>
        
        <el-alert
          :title="`${generatedSkus.length} SKU combinations will be generated`"
          type="info"
          :closable="false"
          class="mb-4"
        />
        
        <div v-if="generatedSkus.length > 0" class="sku-preview">
          <el-table :data="generatedSkus.slice(0, 5)" max-height="300">
            <el-table-column prop="skuCode" label="SKU Code" width="150" />
            <el-table-column label="Specifications" min-width="200">
              <template #default="{ row }">
                <el-tag v-for="(value, key) in row.specifications" :key="key" size="small" class="mr-1">
                  {{ key }}: {{ value }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="Unit" width="100" />
            <el-table-column label="Price" width="120">
              <template #default="{ row }">
                <el-input-number v-model="row.price" :min="0" :precision="2" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="Stock" width="100">
              <template #default="{ row }">
                <el-input-number v-model="row.stock" :min="0" size="small" />
              </template>
            </el-table-column>
          </el-table>
          <div v-if="generatedSkus.length > 5" class="text-center mt-2 text-sm text-gray-500">
            ... and {{ generatedSkus.length - 5 }} more SKUs
          </div>
        </div>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveProduct">
          {{ dialogMode === 'add' ? 'Create Product' : 'Update Product' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- View Product Details Dialog -->
    <el-dialog v-model="viewDialogVisible" title="Product Details" width="700px">
      <div v-if="selectedProduct" class="product-details">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Product Name">{{ selectedProduct.name }}</el-descriptions-item>
          <el-descriptions-item label="Category">{{ selectedProduct.category }}</el-descriptions-item>
          <el-descriptions-item label="Brand">{{ selectedProduct.brand }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="selectedProduct.status === 'active' ? 'success' : 'info'">
              {{ selectedProduct.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Description" :span="2">
            {{ selectedProduct.description }}
          </el-descriptions-item>
          <el-descriptions-item label="Total SKUs">{{ selectedProduct.skus.length }}</el-descriptions-item>
          <el-descriptions-item label="Created At">{{ selectedProduct.createdAt }}</el-descriptions-item>
        </el-descriptions>
        
        <h3 class="text-lg font-semibold mt-6 mb-4">SKU List</h3>
        <el-table :data="selectedProduct.skus" max-height="400">
          <el-table-column prop="skuCode" label="SKU Code" width="150" />
          <el-table-column label="Specifications" min-width="200">
            <template #default="{ row }">
              <el-tag v-for="(value, key) in row.specifications" :key="key" size="small" class="mr-1">
                {{ key }}: {{ value }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="Unit" width="100" />
          <el-table-column label="Price" width="120">
            <template #default="{ row }">
              ${{ row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="Stock" width="100" />
          <el-table-column prop="status" label="Status" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Edit, Delete, View } from '@element-plus/icons-vue'

// Mock data
const products = ref([
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    category: 'electronics',
    brand: 'AudioTech',
    description: 'High-quality wireless headphones with noise cancellation',
    status: 'active',
    createdAt: '2024-01-15',
    skus: [
      { skuCode: 'WH-BLK-PCS', specifications: { Color: 'Black' }, unit: 'pcs', price: 199.99, stock: 50, status: 'active' },
      { skuCode: 'WH-WHT-PCS', specifications: { Color: 'White' }, unit: 'pcs', price: 199.99, stock: 30, status: 'active' },
      { skuCode: 'WH-BLK-BOX', specifications: { Color: 'Black' }, unit: 'box', price: 950.00, stock: 10, status: 'active' },
    ]
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    category: 'clothing',
    brand: 'FashionCo',
    description: 'Comfortable 100% cotton t-shirt',
    status: 'active',
    createdAt: '2024-02-20',
    skus: [
      { skuCode: 'TS-RED-S-PCS', specifications: { Color: 'Red', Size: 'S' }, unit: 'pcs', price: 29.99, stock: 100, status: 'active' },
      { skuCode: 'TS-RED-M-PCS', specifications: { Color: 'Red', Size: 'M' }, unit: 'pcs', price: 29.99, stock: 120, status: 'active' },
      { skuCode: 'TS-RED-L-PCS', specifications: { Color: 'Red', Size: 'L' }, unit: 'pcs', price: 29.99, stock: 80, status: 'active' },
      { skuCode: 'TS-BLU-S-PCS', specifications: { Color: 'Blue', Size: 'S' }, unit: 'pcs', price: 29.99, stock: 90, status: 'active' },
      { skuCode: 'TS-BLU-M-PCS', specifications: { Color: 'Blue', Size: 'M' }, unit: 'pcs', price: 29.99, stock: 110, status: 'active' },
      { skuCode: 'TS-BLU-L-PCS', specifications: { Color: 'Blue', Size: 'L' }, unit: 'pcs', price: 29.99, stock: 70, status: 'active' },
    ]
  },
  {
    id: 3,
    name: 'Organic Coffee Beans',
    category: 'food',
    brand: 'BrewMaster',
    description: 'Premium organic coffee beans from Colombia',
    status: 'active',
    createdAt: '2024-03-10',
    skus: [
      { skuCode: 'CF-DRK-250G', specifications: { Roast: 'Dark' }, unit: '250g', price: 15.99, stock: 200, status: 'active' },
      { skuCode: 'CF-DRK-500G', specifications: { Roast: 'Dark' }, unit: '500g', price: 28.99, stock: 150, status: 'active' },
      { skuCode: 'CF-MED-250G', specifications: { Roast: 'Medium' }, unit: '250g', price: 14.99, stock: 180, status: 'active' },
      { skuCode: 'CF-MED-500G', specifications: { Roast: 'Medium' }, unit: '500g', price: 26.99, stock: 140, status: 'active' },
    ]
  }
])

// Search and filter
const searchQuery = ref('')
const categoryFilter = ref('')

const filteredProducts = computed(() => {
  let result = products.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(query)
      const categoryMatch = product.category.toLowerCase().includes(query)
      const brandMatch = product.brand.toLowerCase().includes(query)
      const skuMatch = product.skus.some(sku => sku.skuCode.toLowerCase().includes(query))
      return nameMatch || categoryMatch || brandMatch || skuMatch
    })
  }

  if (categoryFilter.value) {
    result = result.filter(product => product.category === categoryFilter.value)
  }

  return result
})

const handleSearch = () => {
  // Search is handled by computed property
}

// Dialog management
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const dialogMode = ref('add')
const selectedProduct = ref(null)
const productFormRef = ref(null)

// Product form
const productForm = ref({
  name: '',
  category: '',
  brand: '',
  description: '',
  units: [],
  specifications: [],
  status: 'active'
})

const formRules = {
  name: [{ required: true, message: 'Please enter product name', trigger: 'blur' }],
  category: [{ required: true, message: 'Please select category', trigger: 'change' }],
  brand: [{ required: true, message: 'Please enter brand', trigger: 'blur' }]
}

// Units management
const showUnitInput = ref(false)
const newUnit = ref('')
const unitInputRef = ref(null)

const addUnit = () => {
  if (newUnit.value && !productForm.value.units.includes(newUnit.value)) {
    productForm.value.units.push(newUnit.value)
  }
  newUnit.value = ''
  showUnitInput.value = false
}

const removeUnit = (unit) => {
  const index = productForm.value.units.indexOf(unit)
  if (index > -1) {
    productForm.value.units.splice(index, 1)
  }
}

watch(showUnitInput, (val) => {
  if (val) {
    nextTick(() => {
      unitInputRef.value?.focus()
    })
  }
})

// Specifications management
const addSpecification = () => {
  productForm.value.specifications.push({
    name: '',
    values: []
  })
}

const removeSpecification = (index) => {
  productForm.value.specifications.splice(index, 1)
}

// Cartesian product algorithm for SKU generation
const cartesianProduct = (...arrays) => {
  return arrays.reduce((acc, array) => {
    return acc.flatMap(x => array.map(y => [...x, y]))
  }, [[]])
}

const generatedSkus = computed(() => {
  const { units, specifications } = productForm.value
  
  if (units.length === 0) return []
  
  // Filter out specifications with empty names or no values
  const validSpecs = specifications.filter(spec => spec.name && spec.values.length > 0)
  
  if (validSpecs.length === 0) {
    // Only units, no specifications
    return units.map(unit => ({
      skuCode: generateSkuCode({}, unit),
      specifications: {},
      unit,
      price: 0,
      stock: 0,
      status: 'active'
    }))
  }
  
  // Generate all combinations
  const specValues = validSpecs.map(spec => spec.values)
  const combinations = cartesianProduct(...specValues)
  
  const skus = []
  for (const unit of units) {
    for (const combo of combinations) {
      const specs = {}
      validSpecs.forEach((spec, index) => {
        specs[spec.name] = combo[index]
      })
      
      skus.push({
        skuCode: generateSkuCode(specs, unit),
        specifications: specs,
        unit,
        price: 0,
        stock: 0,
        status: 'active'
      })
    }
  }
  
  return skus
})

const generateSkuCode = (specifications, unit) => {
  const specParts = Object.entries(specifications).map(([key, value]) => {
    return value.substring(0, 3).toUpperCase()
  })
  const unitPart = unit.substring(0, 3).toUpperCase()
  return [...specParts, unitPart].join('-')
}

// CRUD operations
const openAddDialog = () => {
  dialogMode.value = 'add'
  productForm.value = {
    name: '',
    category: '',
    brand: '',
    description: '',
    units: ['pcs'],
    specifications: [],
    status: 'active'
  }
  dialogVisible.value = true
}

const editProduct = (product) => {
  dialogMode.value = 'edit'
  selectedProduct.value = product
  
  // Extract units and specifications from SKUs
  const units = [...new Set(product.skus.map(sku => sku.unit))]
  const specMap = {}
  
  product.skus.forEach(sku => {
    Object.entries(sku.specifications).forEach(([key, value]) => {
      if (!specMap[key]) {
        specMap[key] = new Set()
      }
      specMap[key].add(value)
    })
  })
  
  const specifications = Object.entries(specMap).map(([name, values]) => ({
    name,
    values: Array.from(values)
  }))
  
  productForm.value = {
    name: product.name,
    category: product.category,
    brand: product.brand,
    description: product.description,
    units,
    specifications,
    status: product.status
  }
  
  dialogVisible.value = true
}

const saveProduct = async () => {
  if (!productFormRef.value) return
  
  await productFormRef.value.validate((valid) => {
    if (valid) {
      if (generatedSkus.value.length === 0) {
        ElMessage.warning('Please add at least one unit to generate SKUs')
        return
      }
      
      const productData = {
        ...productForm.value,
        skus: generatedSkus.value,
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      if (dialogMode.value === 'add') {
        productData.id = products.value.length + 1
        products.value.push(productData)
        ElMessage.success('Product added successfully')
      } else {
        const index = products.value.findIndex(p => p.id === selectedProduct.value.id)
        if (index > -1) {
          products.value[index] = { ...products.value[index], ...productData }
          ElMessage.success('Product updated successfully')
        }
      }
      
      dialogVisible.value = false
    }
  })
}

const deleteProduct = (product) => {
  ElMessageBox.confirm(
    `Are you sure you want to delete "${product.name}"?`,
    'Delete Product',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    const index = products.value.findIndex(p => p.id === product.id)
    if (index > -1) {
      products.value.splice(index, 1)
      ElMessage.success('Product deleted successfully')
    }
  }).catch(() => {
    // Cancelled
  })
}

const viewProduct = (product) => {
  selectedProduct.value = product
  viewDialogVisible.value = true
}

// Table helpers
const handleExpandChange = (row, expandedRows) => {
  // Handle expand change if needed
}

const getPriceRange = (product) => {
  const prices = product.skus.map(sku => sku.price)
  return {
    min: Math.min(...prices).toFixed(2),
    max: Math.max(...prices).toFixed(2)
  }
}
</script>

<style scoped>
.product-management {
  padding: 24px;
  background: #0a0a0a;
  min-height: 100vh;
  color: #e5e5e5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  max-width: 500px;
}

.filter-select {
  width: 200px;
}

.product-table {
  background: #1a1a1a;
  border-radius: 8px;
}

.expanded-content {
  padding: 20px;
  background: #0f0f0f;
}

.sku-table {
  margin-top: 12px;
}

.units-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.spec-row {
  margin-bottom: 16px;
}

.spec-item {
  margin-bottom: 0;
}

.spec-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
}

.sku-preview {
  max-height: 400px;
  overflow-y: auto;
}

.product-details {
  padding: 12px 0;
}

:deep(.el-table) {
  background-color: #1a1a1a;
  color: #e5e5e5;
}

:deep(.el-table th.el-table__cell) {
  background-color: #262626;
  color: #e5e5e5;
  border-color: #333;
}

:deep(.el-table tr) {
  background-color: #1a1a1a;
}

:deep(.el-table td.el-table__cell) {
  border-color: #333;
}

:deep(.el-table__expanded-cell) {
  background-color: #0f0f0f;
  padding: 0;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: #262626;
}

:deep(.el-dialog) {
  background-color: #1a1a1a;
  border: 1px solid #333;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #333;
}

:deep(.el-dialog__title) {
  color: #e5e5e5;
}

:deep(.el-form-item__label) {
  color: #a3a3a3;
}

:deep(.el-input__wrapper) {
  background-color: #262626;
  border-color: #404040;
}

:deep(.el-input__inner) {
  color: #e5e5e5;
}

:deep(.el-textarea__inner) {
  background-color: #262626;
  border-color: #404040;
  color: #e5e5e5;
}

:deep(.el-select .el-input__wrapper) {
  background-color: #262626;
}

:deep(.el-tag) {
  border-color: #404040;
}

:deep(.el-descriptions__label) {
  color: #a3a3a3;
}

:deep(.el-descriptions__content) {
  color: #e5e5e5;
}

:deep(.el-divider__text) {
  background-color: #1a1a1a;
  color: #e5e5e5;
}

:deep(.el-button--primary) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.el-button--primary:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}
</style>
