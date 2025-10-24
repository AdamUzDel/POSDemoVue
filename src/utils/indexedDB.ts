/**
 * IndexedDB Utility for Local Data Storage
 * Provides methods to store and retrieve product data locally
 */

import type { Product } from "@/types/product"

const DB_NAME = "iGourdPOS"
const DB_VERSION = 1
const STORE_NAME = "products"

/**
 * Initialize IndexedDB database
 */
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(request.error)
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "id" })

        // Create indexes for efficient querying
        objectStore.createIndex("name", "name", { unique: false })
        objectStore.createIndex("category", "category", { unique: false })
        objectStore.createIndex("status", "status", { unique: false })
        objectStore.createIndex("createdAt", "createdAt", { unique: false })
      }
    }
  })
}

/**
 * Get all products from IndexedDB
 */
export const getAllProducts = async (): Promise<Product[]> => {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly")
    const objectStore = transaction.objectStore(STORE_NAME)
    const request = objectStore.getAll()

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

/**
 * Add a product to IndexedDB
 */
export const addProduct = async (product: Product): Promise<void> => {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const objectStore = transaction.objectStore(STORE_NAME)
    const request = objectStore.add(product)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

/**
 * Update a product in IndexedDB
 */
export const updateProduct = async (product: Product): Promise<void> => {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const objectStore = transaction.objectStore(STORE_NAME)
    const request = objectStore.put(product)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

/**
 * Delete a product from IndexedDB
 */
export const deleteProduct = async (id: string): Promise<void> => {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const objectStore = transaction.objectStore(STORE_NAME)
    const request = objectStore.delete(id)

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}

/**
 * Bulk add products to IndexedDB
 */
export const bulkAddProducts = async (products: Product[]): Promise<void> => {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const objectStore = transaction.objectStore(STORE_NAME)

    let completed = 0
    const total = products.length

    products.forEach((product) => {
      const request = objectStore.add(product)

      request.onsuccess = () => {
        completed++
        if (completed === total) {
          resolve()
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  })
}

/**
 * Clear all products from IndexedDB
 */
export const clearAllProducts = async (): Promise<void> => {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const objectStore = transaction.objectStore(STORE_NAME)
    const request = objectStore.clear()

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error)
    }
  })
}
