import { defineStore } from "pinia"
import { ref, computed } from "vue"
import type { Product } from "@/types/product"

/**
 * Product Store - Manages product data and operations
 * Uses Pinia for state management
 */
export const useProductStore = defineStore("product", () => {
  // State: List of all products
  const products = ref<Product[]>([
    // Sample data for demonstration
    {
      id: "1",
      name: "Premium Wireless Headphones",
      category: "Electronics",
      description: "High-quality wireless headphones with noise cancellation",
      baseUnit: "Piece",
      units: [
        { id: "u1", name: "Piece", conversionRate: 1 },
        { id: "u2", name: "Box", conversionRate: 10 },
      ],
      specifications: [
        { id: "s1", name: "Color", values: ["Black", "White", "Blue"] },
        { id: "s2", name: "Size", values: ["Standard", "Large"] },
      ],
      skus: [
        {
          id: "sku1",
          skuCode: "WH-BLK-STD-PC",
          unit: "Piece",
          specs: { Color: "Black", Size: "Standard" },
          price: 299.99,
          stock: 150,
          status: "active",
        },
        {
          id: "sku2",
          skuCode: "WH-WHT-STD-PC",
          unit: "Piece",
          specs: { Color: "White", Size: "Standard" },
          price: 299.99,
          stock: 80,
          status: "active",
        },
        {
          id: "sku3",
          skuCode: "WH-BLU-LRG-PC",
          unit: "Piece",
          specs: { Color: "Blue", Size: "Large" },
          price: 349.99,
          stock: 45,
          status: "active",
        },
      ],
      status: "active",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
    },
    {
      id: "2",
      name: "Organic Green Tea",
      category: "Food & Beverage",
      description: "Premium organic green tea leaves",
      baseUnit: "Gram",
      units: [
        { id: "u3", name: "Gram", conversionRate: 1 },
        { id: "u4", name: "Pack", conversionRate: 100 },
        { id: "u5", name: "Carton", conversionRate: 1000 },
      ],
      specifications: [
        { id: "s3", name: "Grade", values: ["Premium", "Standard"] },
        { id: "s4", name: "Package", values: ["Bag", "Box"] },
      ],
      skus: [
        {
          id: "sku4",
          skuCode: "GT-PREM-BAG-GRAM",
          unit: "Gram",
          specs: { Grade: "Premium", Package: "Bag" },
          price: 0.5,
          stock: 5000,
          status: "active",
        },
        {
          id: "sku5",
          skuCode: "GT-STD-BOX-PACK",
          unit: "Pack",
          specs: { Grade: "Standard", Package: "Box" },
          price: 35.0,
          stock: 200,
          status: "active",
        },
      ],
      status: "active",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18",
    },
  ])

  // Computed: Get all unique categories
  const categories = computed(() => {
    const cats = new Set(products.value.map((p) => p.category))
    return Array.from(cats)
  })

  // Action: Add a new product
  const addProduct = (product: Product) => {
    products.value.unshift(product)
  }

  // Action: Update an existing product
  const updateProduct = (id: string, updatedProduct: Product) => {
    const index = products.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      products.value[index] = updatedProduct
    }
  }

  // Action: Delete a product
  const deleteProduct = (id: string) => {
    const index = products.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      products.value.splice(index, 1)
    }
  }

  // Action: Get product by ID
  const getProductById = (id: string) => {
    return products.value.find((p) => p.id === id)
  }

  return {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  }
})
