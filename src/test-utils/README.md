# Test Utilities

This directory contains utilities and helpers for testing the application.

## Files

### `setup.js`
Vitest setup file that runs before all tests. Configures:
- `@testing-library/jest-dom` matchers
- Cleanup after each test
- Window.matchMedia mock
- IntersectionObserver mock

### `test-utils.jsx`
Custom render function that wraps components with:
- Redux Provider (with mock store)
- React Router BrowserRouter
- Optional custom wrapper

**Usage:**
```jsx
import { renderWithProviders } from '../test-utils/test-utils';
import MyComponent from './MyComponent';

test('renders component', () => {
  const { getByText } = renderWithProviders(<MyComponent />);
  expect(getByText('Hello')).toBeInTheDocument();
});
```

### `mockStore.js`
Helpers for creating mock Redux stores:
- `createMockStore(preloadedState)` - Create store with custom state
- `createStoreWithProducts(products)` - Store with products loaded
- `createStoreWithFilters(filters)` - Store with filters applied
- `createStoreWithFavorites(favorites)` - Store with favorites

**Usage:**
```jsx
import { createStoreWithProducts } from '../test-utils/mockStore';

const store = createStoreWithProducts([mockProduct1, mockProduct2]);
```

### `mockData.js`
Mock data for tests:
- `mockProducts` - Array of sample products
- `mockProduct` - Single sample product
- `mockCategories` - Array of categories
- `mockStoreState` - Complete initial store state

### `server.js`
MSW (Mock Service Worker) server setup for mocking API calls:
- `server` - MSW server instance
- `setupMSW()` - Setup function (call in test files)
- `addMSWHandler(handler)` - Add custom handler
- `resetMSWHandlers()` - Reset to defaults

**Usage:**
```jsx
import { setupMSW, server } from '../test-utils/server';
import { http, HttpResponse } from 'msw';

setupMSW(); // Call once in test file

// Add custom handler
server.use(
  http.get('/api/products', () => {
    return HttpResponse.json(customProducts);
  })
);
```

## Example Test File

```jsx
import { describe, it, expect } from 'vitest';
import { renderWithProviders } from '../test-utils/test-utils';
import { setupMSW } from '../test-utils/server';
import MyComponent from './MyComponent';

setupMSW();

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = renderWithProviders(<MyComponent />);
    expect(getByText('Hello')).toBeInTheDocument();
  });
});
```

