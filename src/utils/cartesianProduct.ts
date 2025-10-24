import type { ProductUnit, ProductSpec, ProductSKU } from "@/types/product"

/**
 * Cartesian Product Algorithm
 * Generates all possible combinations of units and specifications
 *
 * Example:
 * Units: [Piece, Box]
 * Specs: { Color: [Red, Blue], Size: [S, M] }
 * Result: 8 combinations (2 units × 2 colors × 2 sizes)
 */

interface CartesianInput {
  units: ProductUnit[]
  specifications: ProductSpec[]
}

/**
 * Generate all possible SKU combinations using Cartesian product
 */
export function generateSKUCombinations(input: CartesianInput): Omit<ProductSKU, "id" | "price" | "stock">[] {
  const { units, specifications } = input

  // If no units or specifications, return empty array
  if (units.length === 0) {
    return []
  }

  // Start with units as the base
  let combinations: any[] = units.map((unit) => ({
    unit: unit.name,
    specs: {},
  }))

  // Apply Cartesian product for each specification
  for (const spec of specifications) {
    if (spec.values.length === 0) continue

    const newCombinations: any[] = []

    // For each existing combination, create new combinations with each spec value
    for (const combo of combinations) {
      for (const value of spec.values) {
        newCombinations.push({
          ...combo,
          specs: {
            ...combo.specs,
            [spec.name]: value,
          },
        })
      }
    }

    combinations = newCombinations
  }

  // Generate SKU codes for each combination
  return combinations.map((combo) => ({
    skuCode: generateSKUCode(combo),
    unit: combo.unit,
    specs: combo.specs,
    status: "active" as const,
  }))
}

/**
 * Generate a unique SKU code based on combination
 * Format: PRODUCT-SPEC1-SPEC2-UNIT
 */
function generateSKUCode(combination: any): string {
  const specParts = Object.values(combination.specs)
    .map((v: any) => v.substring(0, 3).toUpperCase())
    .join("-")

  const unitPart = combination.unit.substring(0, 2).toUpperCase()

  return specParts ? `${specParts}-${unitPart}` : unitPart
}

/**
 * Calculate total number of possible combinations
 */
export function calculateCombinationCount(input: CartesianInput): number {
  const { units, specifications } = input

  if (units.length === 0) return 0

  let count = units.length

  for (const spec of specifications) {
    if (spec.values.length > 0) {
      count *= spec.values.length
    }
  }

  return count
}
