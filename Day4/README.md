# Day 4 — Fincons Shopping App

This folder contains a small example shopping app built with React + TypeScript, PrimeReact components and a few custom UI pieces. The app demonstrates routing, remote data fetching, a minimal cart state stored in a React context, product listing with paging and search, and a product details page with reviews.

This README explains how the project is structured, how the main parts work, and what each component is responsible for. It is written to be readable for another developer who will pick up the code and extend it.

---

## Quick start

1. Install dependencies:

```bash
cd Day4
npm install
```

2. Run the dev server:

```bash
npm run dev
```

Open http://localhost:5173 (or the port Vite prints) to view the app.

---

## High level overview

- Routing: `react-router` is used. Routes are declared in `src/App.tsx`:
  - `/` → `Home`
  - `/shop` → `Products`
  - `/products/:id` → `ProductDetails`
- UI library: `primereact` is used for Cards, Buttons, Dialog, Rating, Toast and some form controls.
- Styling: Tailwind utility classes are used directly in JSX; `src/App.css` and `src/index.css` contain project-specific CSS.
- State: Cart state is a simple React Context (`CartContext`) stored at the top level in `App.tsx` and provided to the subtree so any component can add/remove items.
- Data: Product data comes from the public dummyjson API `https://dummyjson.com/products` (see `src/pages/Products.tsx` and `src/pages/ProductDetails.tsx`).

---

## File / folder structure (important files)

- `src/App.tsx` — Root app and router. Provides `CartContext` to children and renders `Navbar` and route components.
- `src/main.tsx` — Application entry; wraps the app in `PrimeReactProvider` and mounts React.
- `src/pages/Home.tsx` — Simple landing page with a call-to-action to go to the shop.
- `src/pages/Products.tsx` — Fetches product list, implements paging and search, and renders `ShowProducts`.
- `src/pages/ProductDetails.tsx` — Shows full details for a single product (images, price, reviews), allows adding reviews via a Dialog, and adding/removing from cart.
- `src/components/Navbar.tsx` — Site navigation bar; shows product links and a cart icon with item count. Contains a mobile menu.
- `src/components/Cart.tsx` — Exports `CartContext` and type definitions for cart items. The context value is a tuple: `[cartItems, setCartItems]` where `cartItems` is an array of `{ productid, value }`.
- `src/components/ShowProducts.tsx` — Renders product cards using `primereact/Card`. Handles add-to-cart and quantity controls per product, and paging controls.
- `src/components/SideBars.tsx`, `src/components/AppSidebar.tsx` — Sidebar examples using the local `ui/sidebar` (shadcn-style) components. Minimal / mostly placeholder code here.
- `src/components/ui/*` — A set of small presentational components used by the sidebar (button, input, separator, sheet, sidebar, skeleton, tooltip). These are reusable primitives with Tailwind styling.
- `src/lib/utils.ts` — Project utility helpers (if present).
- `src/hooks/use-mobile.ts` — Small hook used by the sidebar for mobile detection.
- `src/assets/*` — Images referenced in the UI (product images used as samples/placeholder assets).

---

## How data flows (cart + product listing)

1. `App.tsx` holds a top-level state: `const [cartItems, setCartItems] = useState<CartItem[]>([])` and provides it via `CartContext.Provider`.
2. Components that need cart state (for example `ShowProducts` and `ProductDetails`) call `useContext(CartContext)` and receive the tuple `[cartItems, setCartItems]`.
3. Adding/removing items uses `setCartItems` to update the array. Each cart item in the code is a minimal object: `{ productid: number; value: number }` representing quantity.

Products listing:
- `Products.tsx` calls the remote API and stores a copy of `allProducts` and a paged view `products`. Pagination and search are controlled by local state values (`currentPage`, `searchQuery`, `debounceQuery` etc.).
- Search uses a debounced input: `debounceQuery` updates immediately, but `searchQuery` is applied after a timeout. The search filters `allProducts` by product title and resets paging.
- `ShowProducts` receives the paged `products` list and renders each item with `primereact/Card`. The component also handles quantity UI and add/remove button logic by reading and writing the cart context.

Product details:
- `ProductDetails.tsx` uses `useParams()` to get the product `id`, fetches `https://dummyjson.com/products/${id}`, and displays rich product information: images, price, brand, tags, and reviews.
- Reviews: The page keeps a `product.reviews` array in component state; adding a review appends to that array locally (no persistence to server).

---

## Component responsibilities (human friendly)

- Navbar
  - Displays the app name and navigation buttons (Home, Products).
  - Shows the cart icon and a red badge with the total items count (sum of all item `value`).
  - Has a simple collapsible mobile menu.

- Cart (context)
  - Very small: only types and the exported `CartContext` default. `App.tsx` is the provider. Intentionally minimal so the rest of the app can be focused on UI and flow.

- ShowProducts
  - Displays a grid of products as cards. Each card shows the first image (if present), description, price, and two main actions: See Details and Add to Cart / quantity controls.
  - `Add to Cart` logic merges new items with the existing cart so quantities are maintained.
  - Uses `primereact/Button` and `primereact/Card` for out-of-the-box styling.
  - Simple next/prev pagination buttons are implemented in the component and call `setCurrentPage` passed from the page.

- Products page
  - Responsible for fetching the remote products once and maintaining `allProducts` (raw list) and `products` (paged subset).
  - Derives `totalPages` from `allProducts.length` and the configured `itemsPerPage`.
  - Contains logic to filter by a search query (debounced) and to update the visible page slice.

- ProductDetails
  - Fetches a single product and displays a rich detail view.
  - Allows adding a review through a `Dialog` with `InputText` and `Rating` components.
  - Shows a `Toast` message to give feedback.
  - Add to cart / quantity controls mirror the logic in `ShowProducts`.

- Sidebars / AppSidebar
  - Small wrapper components demonstrating how the project's `ui/sidebar` primitives can be used. Right now they are placeholders and are safe to extend – they won't affect the main layout unless added to `App`.

---

## Styling notes

- The code relies heavily on Tailwind CSS utility classes written inline in JSX. There is no CSS-in-JS in this project.
- `src/App.css` and `src/index.css` contain global styles and any custom utility classes used by the app.
- PrimeReact components are used as-is, and `main.tsx` configures `PrimeReactProvider` with `twMerge` options so class names can be merged where needed.

---

## Known issues / pointers

- Some product image URLs retrieved from the API can be broken (404). The code attempts to show the first available image, but not all API images are guaranteed to exist.
- The cart implementation is intentionally simple: it stores only product id and quantity in memory. For production you would persist this (localStorage / backend) and store richer product metadata in the cart.
- Reviews added in `ProductDetails` are local-only (they are appended to the in-memory product state and not sent to the API).

---

## Next steps / suggestions for improvement

- Persist cart to localStorage or backend and derive UI from a single source of truth.
- Add optimistic UI and server-sync for reviews and purchases.
- Add loading spinners and error states to the network calls for better user experience.
- Extract repeated cart logic into hooks (for example `useCart`) to keep components lean.
- Improve accessibility: add aria labels, keyboard navigation, and ensure images have alt attributes.

---

If you want, I can:
- add a short README to Day7 as well, or
- add persisting cart state to localStorage,
or implement a small `useCart` hook and migrate `ShowProducts` and `ProductDetails` to use it.

---

Authored by: automated README generator (tailored to the Day4 project files in this workspace)
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
