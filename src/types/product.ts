/**
 * Product and SKU type definitions
 * These interfaces define the data structure for products throughout the application
 */

// Product unit definition (e.g., Box, Piece, Carton)
export interface ProductUnit {
  id: string
  name: string
  conversionRate: number // Conversion rate relative to base unit
}

// Product specification (e.g., Color, Size)
export interface ProductSpec {
  id: string
  name: string // Specification name (e.g., "Color")
  values: string[] // Possible values (e.g., ["Red", "Blue", "Green"])
}

// SKU (Stock Keeping Unit) - represents a specific product variant
export interface ProductSKU {
  id: string
  skuCode: string
  unit: string
  specs: Record<string, string> // Key-value pairs of specifications
  price: number
  stock: number
  status: "active" | "inactive"
}

// Main product interface
export interface Product {
  id: string
  name: string
  category: string
  description: string
  baseUnit: string
  units: ProductUnit[]
  specifications: ProductSpec[]
  skus: ProductSKU[]
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

// Form data for adding/editing products
export interface ProductFormData {
  name: string
  category: string
  description: string
  baseUnit: string
  units: ProductUnit[]
  specifications: ProductSpec[]
  status: "active" | "inactive"
}
