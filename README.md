# E-Commerce Product Catalog

A modern, responsive e-commerce product catalog application built with React and Redux Toolkit. This application allows users to browse products, search and filter items, view detailed product information, and manage their favorite products.

## 📋 Project Description

This is a full-featured product catalog application that integrates with the [Fake Store API](https://fakestoreapi.com) to display a wide range of products. The application provides an intuitive user interface with powerful search, filtering, and sorting capabilities. Users can explore products, view detailed information, and save their favorite items for quick access.

### Live Link

https://neura-dynamics-assignment-iota.vercel.app/

### Key Highlights

- **Responsive Design**: Fully responsive layout that works seamlessly across all device sizes
- **Dark Mode Support**: Built-in dark/light theme toggle for enhanced user experience
- **Real-time Search**: Debounced search functionality for instant product filtering
- **Advanced Filtering**: Filter products by category and sort by price
- **Favorites Management**: Save and manage favorite products with persistent state
- **Comprehensive Testing**: Extensive unit and integration test coverage

## 🛠️ Tech Stack

### Core Technologies

- **React 19.2.0** - Modern React with functional components and hooks
- **Redux Toolkit 2.11.2** - State management with async thunks and selectors
- **React Router DOM 7.11.0** - Client-side routing and navigation
- **Vite 7.2.4** - Fast build tool and development server

### Styling

- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Custom CSS** - Gradient backgrounds and custom utilities

### Testing

- **Vitest 1.0.4** - Fast unit test framework
- **React Testing Library 16.0.1** - Component testing utilities
- **MSW 2.0.0** - API mocking for integration tests
- **jsdom 23.0.1** - DOM environment for testing

### Development Tools

- **ESLint 9.39.1** - Code linting and quality checks
- **TypeScript Types** - Type definitions for React

## ✨ Features

### 1. Product Listing Page

- **Responsive Grid Layout**: Products displayed in a responsive grid (1-4 columns based on screen size)
- **Product Cards**: Beautiful product cards with images, titles, prices, and ratings
- **Loading States**: Skeleton loaders for better UX during data fetching
- **Empty States**: User-friendly messages when no products are available

### 2. Search & Filter Functionality

- **Debounced Search**: Real-time search with 500ms debounce delay for optimal performance
- **Category Filtering**: Filter products by category (All, Electronics, Jewelry, Men's Clothing, etc.)
- **Price Sorting**: Sort products by price (Low to High, High to Low, Default)
- **Combined Filters**: All filters work together seamlessly
- **Clear Filters**: One-click option to reset all active filters

### 3. Product Detail Page

- **Complete Product Information**: Detailed view with images, description, price, rating, and category
- **Add to Favorites**: Toggle favorite status directly from the detail page
- **Navigation**: Easy navigation back to product listing
- **Loading & Error States**: Proper handling of loading and error scenarios

### 4. Favorites Page

- **Favorite Products Display**: Grid view of all favorited products
- **Favorite Count**: Shows total number of favorited items
- **Remove Favorites**: Remove items from favorites list
- **Empty State**: Helpful message when no favorites exist
- **Persistent State**: Favorites stored in Redux store

### 5. Additional Features

- **Dark Mode Toggle**: Switch between light and dark themes
- **Responsive Navigation**: Mobile-friendly navigation bar
- **Accessibility**: Focus states, semantic HTML, and ARIA-friendly components
- **Error Handling**: Comprehensive error handling for API failures
- **Loading Indicators**: Skeleton loaders and loading states throughout

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/sarthakastic/neura-dynamics-assignment.git
   cd neura-dynamics-assignment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration (Optional)**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=https://fakestoreapi.com
   ```

   > Note: The application will use `https://fakestoreapi.com` as the default API URL if not specified.

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Open Vitest UI
- `npm run test:coverage` - Generate test coverage report

## 🧪 Testing

### Test Structure

The project includes comprehensive test coverage organized into three main categories:

#### 1. Unit Tests

- **Redux Slices**: Test all Redux actions, reducers, and async thunks

  - `productSlice.test.js` - Product fetching and state management
  - `filtersSlice.test.js` - Filter and search functionality
  - `favoritesSlice.test.js` - Favorites management

- **Components**: Test individual component behavior

  - `SearchBar.test.jsx` - Search input and debouncing
  - `ProductCard.test.jsx` - Product card rendering and interactions
  - `CategoryFilter.test.jsx` - Category filtering
  - `SortByPrice.test.jsx` - Price sorting
  - `Button.test.jsx`, `EmptyState.test.jsx`, `Shimmer.test.jsx` - UI components

- **Pages**: Test page-level components

  - `Home.test.jsx` - Product listing page
  - `ProductDetail.test.jsx` - Product detail page
  - `MyFavourites.test.jsx` - Favorites page

- **Hooks**: Test custom React hooks
  - `useFilteredProducts.test.jsx` - Product filtering logic

#### 2. Integration Tests

- **Search Integration** (`search.integration.test.jsx`)

  - Real-time search filtering
  - Case-insensitive search
  - Search with category filters
  - Search with sorting
  - Debounce functionality

- **Filter Integration** (`filter.integration.test.jsx`)

  - Category filtering
  - Active category highlighting
  - Filter combinations
  - Clear filters functionality

- **Sort Integration** (`sort.integration.test.jsx`)

  - Price sorting (low to high, high to low)
  - Sort with filters
  - Sort state persistence

- **Favorite Integration** (`favorite.integration.test.jsx`)
  - Add/remove favorites
  - Favorites persistence
  - Favorites page navigation
  - Favorite count updates

#### 3. End-to-End Tests

- **E2E Flows** (`e2e-flows.test.jsx`)
  - Complete user journeys
  - Search → Filter → Sort flows
  - Browse → View Detail → Add to Favorites flows
  - Complex filter combinations
  - State persistence across navigation

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Utilities

The project includes a comprehensive test utilities setup:

- **MSW (Mock Service Worker)**: API mocking for integration tests
- **Custom Render**: Redux and Router providers for component testing
- **Mock Store**: Pre-configured Redux store for testing
- **Mock Data**: Reusable test data fixtures

## 📊 Test Coverage

The project maintains high test coverage across all major components and functionality:

- **Redux Slices**: 100% coverage of actions, reducers, and async thunks
- **Components**: Comprehensive coverage of user interactions and rendering
- **Pages**: Full coverage of page-level functionality
- **Hooks**: Complete coverage of custom hook logic
- **Integration Tests**: End-to-end coverage of user flows

- 📊 Overall Test Coverage Summary

┌─────────────┬──────────┬──────────┬──────────┐
│ Category    │ Coverage │ Covered  │ Total    │
├─────────────┼──────────┼──────────┼──────────┤
│ Statements  │  79.79% │     1232 │     1544 │
│ Branches    │  88.33% │      159 │      180 │
│ Functions   │  81.40% │       35 │       43 │
│ Lines       │  79.79% │     1232 │     1544 │
└─────────────┴──────────┴──────────┴──────────┘

🎯 Overall Coverage: 82.33%

To view the detailed coverage report:

```bash
npm run test:coverage
```

The coverage report will be generated in the `coverage/` directory. Open `coverage/index.html` in a browser to view the detailed report.

## 🏗️ Project Architecture

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── __tests__/       # Component unit tests
│   ├── skeletons/       # Loading skeleton components
│   └── ui/              # Base UI components (Button, EmptyState, etc.)
│
├── pages/               # Page-level components
│   ├── __tests__/       # Page unit tests
│   ├── Home.jsx         # Product listing page
│   ├── ProductDetail.jsx # Product detail page
│   └── MyFavourites.jsx # Favorites page
│
├── redux/               # Redux state management
│   ├── slices/          # Redux slices
│   │   ├── __tests__/   # Redux slice tests
│   │   ├── productSlice.js    # Products state
│   │   ├── filtersSlice.js    # Filters state
│   │   ├── favoritesSlice.js  # Favorites state
│   │   └── selectors.js       # Redux selectors
│   └── store.js         # Redux store configuration
│
├── hooks/               # Custom React hooks
│   ├── __tests__/       # Hook tests
│   ├── useDebounce.js          # Debounce hook
│   ├── useFilteredProducts.js # Product filtering logic
│   ├── useProductDetail.js    # Product detail logic
│   └── useTheme.js             # Theme management
│
├── integration/         # Integration tests
│   └── __tests__/       # E2E and integration tests
│
├── test-utils/          # Testing utilities
│   ├── mockData.js      # Test data fixtures
│   ├── mockStore.js     # Mock Redux store
│   ├── server.js        # MSW server setup
│   └── test-utils.jsx   # Custom render utilities
│
├── utils/               # Utility functions
│   └── constants.js     # Application constants
│
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles
```

### State Management Architecture

The application uses **Redux Toolkit** for centralized state management:

#### Redux Store Structure

```javascript
{
  products: {
    products: [],           // All products
    product: null,         // Selected product
    productsLoading: false,
    productLoading: false,
    productsError: null,
    productError: null
  },
  filters: {
    searchQuery: "",       // Search input
    category: "all",       // Selected category
    sortOrder: "none",     // Sort order
    productByCategory: [] // Available categories
  },
  favorites: {
    items: []              // Favorite products
  }
}
```

#### Async Operations

- **createAsyncThunk**: Used for API calls (fetchProducts, fetchProductById, fetchProductByCategory)
- **Redux Thunks**: Handle async operations with proper loading and error states


### Component Architecture

#### Component Hierarchy

```
App
└── Layout
    ├── Navbar
    └── Routes
        ├── Home
        │   ├── SearchBar
        │   ├── CategoryFilter
        │   ├── SortByPrice
        │   └── ProductCard (multiple)
        ├── ProductDetail
        │   └── ProductDetailView
        └── MyFavourites
            └── ProductCard (multiple)
```


### Data Flow

1. **Initial Load**: App → Redux Store → API → Products State
2. **User Interaction**: Component → Action → Redux Store → Selector → Component Update
3. **Search/Filter**: User Input → Debounce → Redux Action → Selector → Filtered Products
4. **Favorites**: User Click → Redux Action → Favorites State → UI Update

### API Integration

- **Base URL**: Configurable via environment variables (defaults to Fake Store API)
- **Endpoints**:
  - `GET /products` - Fetch all products
  - `GET /products/:id` - Fetch single product
  - `GET /products/categories` - Fetch categories
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Skeleton loaders during API calls

## 📝 Additional Notes

### Accessibility

- Semantic HTML elements
- Keyboard navigation support
- Focus states for interactive elements
- ARIA-friendly component structure

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile, tablet, and desktop
