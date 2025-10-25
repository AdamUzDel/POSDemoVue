<template>
  <el-dialog
    v-model="dialogVisible"
    :title="mode === 'add' ? 'Add New Product' : 'Edit Product'"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="140px"
      label-position="left"
    >
      <!-- Basic Information Section -->
      <div class="form-section">
        <h3 class="section-title">Basic Information</h3>
        
        <el-form-item label="Product Name" prop="name">
          <el-input v-model="formData.name" placeholder="Enter product name" />
        </el-form-item>

        <el-form-item label="Category" prop="category">
          <el-input v-model="formData.category" placeholder="Enter category" />
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="Enter product description"
          />
        </el-form-item>

        <el-form-item label="Base Unit" prop="baseUnit">
          <el-input v-model="formData.baseUnit" placeholder="e.g., Piece, Gram, Liter" />
        </el-form-item>

        <el-form-item label="Status" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">Active</el-radio>
            <el-radio label="inactive">Inactive</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <!-- Units Section -->
      <div class="form-section">
        <h3 class="section-title">
          Units
          <el-button type="primary" size="small" @click="addUnit">
            <el-icon><Plus /></el-icon>
            <span style="margin-left: 0.25rem">Add Unit</span>
          </el-button>
        </h3>

        <div v-for="(unit, index) in formData.units" :key="unit.id" class="dynamic-item">
          <el-form-item :label="`Unit ${index + 1}`" class="unit-item">
            <div class="unit-inputs">
              <el-input
                v-model="unit.name"
                placeholder="Unit name (e.g., Box)"
                style="width: 200px"
              />
              <el-input-number
                v-model="unit.conversionRate"
                :min="1"
                placeholder="Conversion rate"
                style="width: 150px"
              />
              <span class="unit-hint">× base unit</span>
              <el-button
                type="danger"
                size="small"
                circle
                @click="removeUnit(index)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </el-form-item>
        </div>
      </div>

      <!-- Specifications Section -->
      <div class="form-section">
        <h3 class="section-title">
          Specifications
          <el-button type="primary" size="small" @click="addSpecification">
            <el-icon><Plus /></el-icon>
            <span style="margin-left: 0.25rem">Add Specification</span>
          </el-button>
        </h3>

        <div v-for="(spec, index) in formData.specifications" :key="spec.id" class="dynamic-item">
          <el-form-item :label="`Spec ${index + 1}`" class="spec-item">
            <div class="spec-inputs">
              <el-input
                v-model="spec.name"
                placeholder="Spec name (e.g., Color)"
                style="width: 150px"
              />
              <el-select
                v-model="spec.values"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="Enter values and press Enter"
                style="flex: 1"
              >
              </el-select>
              <el-button
                type="danger"
                size="small"
                circle
                @click="removeSpecification(index)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </el-form-item>
        </div>
      </div>

      <!-- SKU Preview Section -->
      <div v-if="skuPreview.length > 0" class="form-section">
        <h3 class="section-title">
          SKU Preview
          <el-tag type="info" size="small">{{ skuPreview.length }} combinations</el-tag>
        </h3>
        
        <el-alert
          type="info"
          :closable="false"
          style="margin-bottom: 1rem"
        >
          <template #title>
            Generated using Cartesian Product Algorithm: 
            {{ formData.units.length }} units × 
            {{ getSpecCombinations() }} spec combinations = 
            {{ skuPreview.length }} SKUs
          </template>
        </el-alert>

        <div class="sku-preview-grid">
          <div v-for="(sku, index) in skuPreview" :key="index" class="sku-preview-item">
            <div class="sku-code">{{ sku.skuCode }}</div>
            <div class="sku-details">
              <el-tag size="small">{{ sku.unit }}</el-tag>
              <el-tag
                v-for="(value, key) in sku.specs"
                :key="key"
                size="small"
                type="info"
              >
                {{ key }}: {{ value }}
              </el-tag>
            </div>
            <div class="sku-inputs">
              <el-input-number
                v-model="sku.price"
                :min="0"
                :precision="2"
                placeholder="Price"
                size="small"
                style="width: 120px"
              />
              <el-input-number
                v-model="sku.stock"
                :min="0"
                placeholder="Stock"
                size="small"
                style="width: 100px"
              />
            </div>
          </div>
        </div>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        {{ mode === 'add' ? 'Add Product' : 'Update Product' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
// import { Plus, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Product, ProductFormData, /* ProductUnit, ProductSpec, */ ProductSKU } from '@/types/product'
import { generateSKUCombinations } from '@/utils/cartesianProduct'

// const PlusIcon = Plus
// const DeleteIcon = Delete

// Props
const props = defineProps<{
  modelValue: boolean
  product: Product | null
  mode: 'add' | 'edit'
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [product: Product]
}>()

// Dialog visibility
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// Form reference
const formRef = ref<FormInstance>()
const submitting = ref(false)

// Form data with default values
const formData = ref<ProductFormData>({
  name: '' ,
  category: '',
  description: '',
  baseUnit: '',
  units: [],
  specifications: [],
  status: 'active',
})

// SKU preview with price and stock
const skuPreview = ref<ProductSKU[]>([])

// Form validation rules
const rules: FormRules = {
  name: [{ required: true, message: 'Please enter product name', trigger: 'blur' }],
  category: [{ required: true, message: 'Please enter category', trigger: 'blur' }],
  baseUnit: [{ required: true, message: 'Please enter base unit', trigger: 'blur' }],
}

/* watch(
  () => [props.product, props.mode, props.modelValue],
  ([newProduct, newMode, isVisible]) => {
    if (isVisible && newProduct && newMode === 'edit') {
      // Deep clone the product data to avoid mutating the original
      formData.value = {
        name: "",
        category: "",
        description: "",
        baseUnit: "",
        units: JSON.parse(JSON.stringify("")),
        specifications: JSON.parse(JSON.stringify("")),
        status: ["active" | "inactive"],
      }
      
      // Pre-fill SKU preview with existing SKUs
      skuPreview.value = JSON.parse(JSON.stringify(newProduct.skus))
    } else if (isVisible && newMode === 'add') {
      // Reset form for add mode
      resetForm()
    }
  },
  { immediate: true }
)
 */

// Watch for changes in units and specifications to regenerate SKU preview
watch(
  () => [formData.value.units, formData.value.specifications],
  () => {
    generateSKUPreview()
  },
  { deep: true }
)

// Generate SKU preview using Cartesian product
const generateSKUPreview = () => {
  if (formData.value.units.length === 0) {
    skuPreview.value = []
    return
  }

  const combinations = generateSKUCombinations({
    units: formData.value.units,
    specifications: formData.value.specifications,
  })

  // Preserve existing price and stock if SKU already exists
  skuPreview.value = combinations.map((combo, index) => {
    const existingSKU = skuPreview.value.find(
      (sku) => sku.skuCode === combo.skuCode
    )

    return {
      id: existingSKU?.id || `sku-${Date.now()}-${index}`,
      ...combo,
      price: existingSKU?.price || 0,
      stock: existingSKU?.stock || 0,
    }
  })
}

// Calculate specification combinations for display
const getSpecCombinations = (): number => {
  if (formData.value.specifications.length === 0) return 1
  
  return formData.value.specifications.reduce(
    (acc, spec) => acc * (spec.values.length || 1),
    1
  )
}

// Add new unit
const addUnit = () => {
  formData.value.units.push({
    id: `unit-${Date.now()}`,
    name: '',
    conversionRate: 1,
  })
}

// Remove unit
const removeUnit = (index: number) => {
  formData.value.units.splice(index, 1)
}

// Add new specification
const addSpecification = () => {
  formData.value.specifications.push({
    id: `spec-${Date.now()}`,
    name: '',
    values: [],
  })
}

// Remove specification
const removeSpecification = (index: number) => {
  formData.value.specifications.splice(index, 1)
}

// Handle form submission
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // Validate that at least one unit exists
    if (formData.value.units.length === 0) {
      ElMessage.error('Please add at least one unit')
      return
    }

    // Validate that all SKUs have price and stock
    const invalidSKUs = skuPreview.value.filter(
      (sku) => sku.price <= 0 || sku.stock < 0
    )
    if (invalidSKUs.length > 0) {
      ElMessage.error('Please set valid price and stock for all SKUs')
      return
    }

    submitting.value = true

    // Create product object
    const product: Product = {
      id: props.product?.id || `prod-${Date.now()}`,
      ...formData.value,
      skus: skuPreview.value,
      createdAt: props.product?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }

    emit('submit', product)
    submitting.value = false
  } catch (error) {
    console.error('[v0] Form validation failed:', error)
    submitting.value = false
  }
}

// Handle dialog close
const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

// Reset form to initial state
const resetForm = () => {
  formData.value = {
    name: '',
    category: '',
    description: '',
    baseUnit: '',
    units: [],
    specifications: [],
    status: 'active',
  }
  skuPreview.value = []
  formRef.value?.resetFields()
}
</script>

<style scoped>
.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: #667eea;
  font-size: 1.1rem;
}

.dynamic-item {
  margin-bottom: 1rem;
}

.unit-inputs,
.spec-inputs {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
}

.unit-hint {
  color: #909399;
  font-size: 0.9rem;
  white-space: nowrap;
}

.sku-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.sku-preview-item {
  padding: 1rem;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.sku-code {
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.sku-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.sku-inputs {
  display: flex;
  gap: 0.5rem;
}

:deep(.el-form-item) {
  margin-bottom: 1rem;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
