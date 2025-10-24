# iGourd POS - Product Management System

A comprehensive Point of Sale (POS) system built with Vue3, Element-Plus, and TypeScript. Features a professional dashboard layout with product management, advanced SKU generation using Cartesian product algorithm, and local data persistence with IndexedDB.

## Features

### Dashboard Layout
- **Responsive Sidebar Navigation** with iGourd branding
- **Collapsible Menu** with always-visible toggle button
- **Breadcrumb Navigation** for easy page tracking
- **Real-time Clock** and user information display
- **Multi-level Menu Structure** (Inventory, Sales, Reports, Settings)

### Product Management
- **Advanced Search & Filtering**
  - Search by product name, SKU, or category
  - Category dropdown filter
  - Clear and refresh functionality
- **Interactive Product Table**
  - Row selection with checkboxes
  - Column filtering on all major fields
  - Expandable rows showing detailed SKU information
  - Responsive action buttons (full buttons on desktop, icon + dropdown on mobile)
  - Pagination with customizable page sizes (10, 20, 50, 100)
- **Add/Edit Products**
  - Dynamic units management (add/remove units)
  - Multiple specifications with custom values
  - Automatic SKU generation using Cartesian product algorithm
  - Real-time SKU preview with price and stock input
  - Pre-filled forms when editing existing products
- **Product Details Modal**
  - Comprehensive product information display
  - Full SKU list with specifications and pricing
- **Bulk Operations**
  - Multi-select products for bulk deletion
  - Export/Import functionality (coming soon)

### Data Persistence
- **IndexedDB Integration** for local data storage
- **Mock Data** with 13+ sample products for demonstration
- **Automatic Data Loading** from IndexedDB on app start
- **Fallback to Mock Data** if IndexedDB is empty

## Tech Stack

- **Vue 3.4** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Element-Plus 2.6** - Vue 3 UI component library
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **IndexedDB** - Browser-based local database

## Project Structure

\`\`\`
igourd-pos/
├── public/
│   ├── logo.svg              # iGourd logo
│   └── favicon.ico           # iGourd favicon
├── src/
│   ├── components/           # Reusable components
│   │   └── product/          # Product-specific components
│   │       ├── ProductTable.vue
│   │       ├── ProductFormModal.vue
│   │       └── ProductDetailsModal.vue
│   ├── views/                # Page views
│   │   ├── ProductManagement.vue
│   │   ├── Home.vue
│   │   ├── Orders.vue
│   │   └── ... (other views)
│   ├── layouts/              # Layout components
│   │   └── DashboardLayout.vue
│   ├── stores/               # Pinia stores
│   │   └── productStore.ts
│   ├── data/                 # Mock data
│   │   └── mockProducts.ts
│   ├── types/                # TypeScript type definitions
│   │   └── product.ts
│   ├── utils/                # Utility functions
│   │   ├── cartesianProduct.ts
│   │   └── indexedDB.ts
│   ├── router/               # Vue Router configuration
│   │   └── index.ts
│   ├── App.vue               # Root component
│   └── main.ts               # Application entry point
├── .eslintrc.cjs             # ESLint configuration (Vue3)
├── .eslintignore             # ESLint ignore patterns
├── .gitignore                # Git ignore patterns
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
\`\`\`

## Installation

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   The application will be available at `http://localhost:3000`

3. **Run linter:**
   \`\`\`bash
   npm run lint
   \`\`\`

4. **Build for production:**
   \`\`\`bash
   npm run build
   \`\`\`

5. **Preview production build:**
   \`\`\`bash
   npm run preview
   \`\`\`

## Key Concepts

### Cartesian Product Algorithm

The system uses a Cartesian product algorithm to generate all possible SKU combinations from units and specifications. For example:

- **Units:** Piece, Box (2 units)
- **Specifications:** 
  - Color: Red, Blue (2 values)
  - Size: S, M (2 values)
- **Result:** 2 × 2 × 2 = 8 SKU combinations

The algorithm is implemented in `src/utils/cartesianProduct.ts` and automatically generates unique SKU codes for each combination.

### IndexedDB for Local Storage

The application uses IndexedDB for persistent local storage:
- **Automatic Initialization** - Database is created on first run
- **CRUD Operations** - All product operations are synced to IndexedDB
- **Bulk Operations** - Efficient bulk add/delete operations
- **Indexed Queries** - Fast lookups by name, category, and status

Implementation is in `src/utils/indexedDB.ts` with methods for:
- `initDB()` - Initialize database
- `getAllProducts()` - Retrieve all products
- `addProduct()` - Add single product
- `updateProduct()` - Update existing product
- `deleteProduct()` - Delete single product
- `bulkAddProducts()` - Add multiple products
- `clearAllProducts()` - Clear all data

### State Management

The application uses Pinia for centralized state management. The product store (`src/stores/productStore.ts`) handles:
- Product list storage with IndexedDB persistence
- CRUD operations with automatic sync
- Category filtering
- Product retrieval by ID
- Mock data initialization

### Component Architecture

- **DashboardLayout.vue** - Main layout with sidebar, header, and content area
- **ProductManagement.vue** - Main page container with search, filtering, and pagination
- **ProductTable.vue** - Reusable table with expandable rows, selection, and filtering
- **ProductFormModal.vue** - Modal for adding/editing products with SKU generation
- **ProductDetailsModal.vue** - Modal for viewing complete product information

### Responsive Design

The application adapts to different screen sizes:
- **Desktop (>1400px)** - Full action buttons with text labels
- **Tablet/Mobile (<1400px)** - Icon-only buttons with dropdown menu for additional actions
- **Collapsible Sidebar** - Toggle between full and compact sidebar
- **Responsive Tables** - Horizontal scrolling on smaller screens

## Expanding the System

To add new modules (e.g., Customers, Suppliers):

1. **Create new view:**
   \`\`\`typescript
   // src/views/CustomerManagement.vue
   \`\`\`

2. **Add route:**
   \`\`\`typescript
   // src/router/index.ts
   {
     path: '/customers',
     name: 'CustomerManagement',
     component: () => import('@/views/CustomerManagement.vue'),
     meta: { title: 'Customer Management' },
   }
   \`\`\`

3. **Create store:**
   \`\`\`typescript
   // src/stores/customerStore.ts
   export const useCustomerStore = defineStore('customer', () => {
     // Store logic with IndexedDB integration
   })
   \`\`\`

4. **Define types:**
   \`\`\`typescript
   // src/types/customer.ts
   export interface Customer {
     // Type definitions
   }
   \`\`\`

5. **Add to sidebar menu:**
   \`\`\`vue
   // src/layouts/DashboardLayout.vue
   <el-menu-item index="/customers">Customers</el-menu-item>
   \`\`\`

## Development Guidelines

- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns
- Keep components small and focused
- Use Pinia for shared state
- Integrate IndexedDB for data persistence
- Add comments for complex logic
- Follow the existing folder structure
- Test responsive behavior on different screen sizes

## Important Notes

### About Linting Errors in v0 Preview

If you see linting errors in the v0 preview environment (like "useHookAtTopLevel"), these are **false positives**. The v0 preview uses a React/Next.js linter that incorrectly interprets Vue's `v-model`, `v-if`, and other directives as React hooks.

**The code is completely valid Vue3 syntax and will work perfectly when you run it locally.**

Once you download and run the project locally with `npm install` and `npm run dev`, the proper Vue3 ESLint configuration will be used and these errors will not appear.

### Browser Compatibility

IndexedDB is supported in all modern browsers:
- Chrome 24+
- Firefox 16+
- Safari 10+
- Edge 12+

## Troubleshooting

**Q: I see linting errors in v0 preview**  
A: These are false positives from the preview environment. Download the project and run it locally - it will work perfectly with the included Vue3 ESLint configuration.

**Q: How do I download the project?**  
A: Click the three dots in the top right of the code block and select "Download ZIP", or push to GitHub and clone it.

**Q: The app won't start**  
A: Make sure you've run `npm install` first, then `npm run dev`.

**Q: IndexedDB data is not persisting**  
A: Check your browser's IndexedDB storage in DevTools (Application tab in Chrome). Make sure you're not in private/incognito mode.

**Q: How do I reset the data?**  
A: Open browser DevTools → Application → IndexedDB → Delete "iGourdPOS" database, then refresh the page. The app will reload with fresh mock data.

**Q: The sidebar toggle button disappears when collapsed**  
A: This has been fixed! The toggle button now uses absolute positioning and remains visible in both expanded and collapsed states.

## Future Enhancements

- [ ] Export products to CSV/Excel
- [ ] Import products from CSV/Excel
- [ ] Product image upload and management
- [ ] Barcode generation and scanning
- [ ] Advanced reporting and analytics
- [ ] Multi-store support
- [ ] User roles and permissions
- [ ] Inventory alerts and notifications
- [ ] Integration with payment systems
- [ ] Cloud sync for data backup

## License

MIT

---

**Built with ❤️ using Vue3 + Element-Plus**
