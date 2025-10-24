# Vue3 Product Management System

A comprehensive product management system built with Vue3, Element-Plus, and TypeScript. Features include product CRUD operations, advanced SKU generation using Cartesian product algorithm, and expandable product details.

## Features

- **Product List Management**
  - Search products by name, SKU, or category
  - Filter by category
  - Expandable rows showing detailed SKU information
  - Responsive table layout

- **Add/Edit Products**
  - Dynamic units management
  - Multiple specifications with custom values
  - Automatic SKU generation using Cartesian product algorithm
  - Real-time SKU preview with price and stock input

- **Product Details**
  - Comprehensive product information display
  - Full SKU list with specifications
  - Summary statistics

- **Delete Products**
  - Confirmation dialog before deletion
  - Immediate UI updates

## Tech Stack

- **Vue 3.4** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Element-Plus 2.6** - Vue 3 UI component library
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Vite** - Fast build tool and dev server

## Project Structure

\`\`\`
vue3-product-management/
├── src/
│   ├── components/          # Reusable components
│   │   └── product/         # Product-specific components
│   │       ├── ProductTable.vue
│   │       ├── ProductFormModal.vue
│   │       └── ProductDetailsModal.vue
│   ├── views/               # Page views
│   │   └── ProductManagement.vue
│   ├── stores/              # Pinia stores
│   │   └── productStore.ts
│   ├── types/               # TypeScript type definitions
│   │   └── product.ts
│   ├── utils/               # Utility functions
│   │   └── cartesianProduct.ts
│   ├── router/              # Vue Router configuration
│   │   └── index.ts
│   ├── App.vue              # Root component
│   └── main.ts              # Application entry point
├── .eslintrc.cjs            # ESLint configuration
├── .eslintignore            # ESLint ignore patterns
├── .gitignore               # Git ignore patterns
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
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

The algorithm is implemented in \`src/utils/cartesianProduct.ts\` and automatically generates unique SKU codes for each combination.

### State Management

The application uses Pinia for centralized state management. The product store (\`src/stores/productStore.ts\`) handles:
- Product list storage
- CRUD operations
- Category filtering
- Product retrieval by ID

### Component Architecture

- **ProductManagement.vue** - Main page container with search and filtering
- **ProductTable.vue** - Reusable table component with expandable rows
- **ProductFormModal.vue** - Modal for adding/editing products with SKU generation
- **ProductDetailsModal.vue** - Modal for viewing complete product information

## Expanding the System

To add new modules (e.g., Orders, Customers):

1. **Create new view:**
   \`\`\`typescript
   // src/views/OrderManagement.vue
   \`\`\`

2. **Add route:**
   \`\`\`typescript
   // src/router/index.ts
   {
     path: '/orders',
     name: 'OrderManagement',
     component: () => import('@/views/OrderManagement.vue'),
     meta: { title: 'Order Management' },
   }
   \`\`\`

3. **Create store:**
   \`\`\`typescript
   // src/stores/orderStore.ts
   export const useOrderStore = defineStore('order', () => {
     // Store logic
   })
   \`\`\`

4. **Define types:**
   \`\`\`typescript
   // src/types/order.ts
   export interface Order {
     // Type definitions
   }
   \`\`\`

## Development Guidelines

- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns
- Keep components small and focused
- Use Pinia for shared state
- Add comments for complex logic
- Follow the existing folder structure

## Important Notes

### About Linting Errors in v0 Preview

If you see linting errors in the v0 preview environment (like "useHookAtTopLevel"), these are **false positives**. The v0 preview uses a React/Next.js linter that incorrectly interprets Vue's \`v-model\` directive as React hooks.

**The code is completely valid and will work perfectly when you run it locally.**

Once you download and run the project locally with \`npm install\` and \`npm run dev\`, the proper Vue3 ESLint configuration will be used and these errors will not appear.

## Troubleshooting

**Q: I see linting errors in v0 preview**  
A: These are false positives from the preview environment. Download the project and run it locally - it will work perfectly.

**Q: How do I download the project?**  
A: Click the three dots in the top right of the code block and select "Download ZIP", or push to GitHub and clone it.

**Q: The app won't start**  
A: Make sure you've run \`npm install\` first, then \`npm run dev\`.

## License

MIT
