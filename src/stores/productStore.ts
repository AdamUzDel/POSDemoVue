import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Product } from "@/types/product"
import { mockProducts } from "@/data/mockProducts"
import * as indexedDB from "@/utils/indexedDB"

/**
 * Product Store - Manages product data and operations
 * Uses Pinia for state management and IndexedDB for local persistence
 */
export const useProductStore = defineStore("product", () => {
  // State: List of all products
  const products = ref<Product[]>([])
  const loading = ref(false)
  const initialized = ref(false)

  // Computed: Get all unique categories
  const categories = computed(() => {
    const cats = new Set(products.value.map((p) => p.category))
    return Array.from(cats)
  })

  /**
   * Initialize store - Load products from IndexedDB or use mock data
   */
  const initialize = async () => {
    if (initialized.value) return

    loading.value = true
    try {
      // Try to load products from IndexedDB
      const storedProducts = await indexedDB.getAllProducts()

      if (storedProducts.length > 0) {
        // Use stored products if available
        products.value = storedProducts
      } else {
        // Otherwise, load mock data and save to IndexedDB
        products.value = mockProducts
        await indexedDB.bulkAddProducts(mockProducts)
      }

      initialized.value = true
    } catch (error) {
      console.error("[v0] Failed to initialize product store:", error)
      // Fallback to mock data if IndexedDB fails
      products.value = mockProducts
    } finally {
      loading.value = false
    }
  }

  /**
   * Action: Add a new product
   */
  const addProduct = async (product: Product) => {
    try {
      // Add to IndexedDB
      await indexedDB.addProduct(product)
      // Add to local state
      products.value.unshift(product)
    } catch (error) {
      console.error("[v0] Failed to add product:", error)
      throw error
    }
  }

  /**
   * Action: Update an existing product
   */
  const updateProduct = async (id: string, updatedProduct: Product) => {
    try {
      // Update in IndexedDB
      await indexedDB.updateProduct(updatedProduct)
      // Update in local state
      const index = products.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        products.value[index] = updatedProduct
      }
    } catch (error) {
      console.error("[v0] Failed to update product:", error)
      throw error
    }
  }

  /**
   * Action: Delete a product
   */
  const deleteProduct = async (id: string) => {
    try {
      // Delete from IndexedDB
      await indexedDB.deleteProduct(id)
      // Delete from local state
      const index = products.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        products.value.splice(index, 1)
      }
    } catch (error) {
      console.error("[v0] Failed to delete product:", error)
      throw error
    }
  }

  /**
   * Action: Get product by ID
   */
  const getProductById = (id: string) => {
    return products.value.find((p) => p.id === id)
  }

  /**
   * Action: Reset to mock data (for development/testing)
   */
  const resetToMockData = async () => {
    try {
      loading.value = true
      // Clear IndexedDB
      await indexedDB.clearAllProducts()
      // Load mock data
      await indexedDB.bulkAddProducts(mockProducts)
      products.value = mockProducts
    } catch (error) {
      console.error("[v0] Failed to reset to mock data:", error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    categories,
    initialize,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    resetToMockData,
  }
})
