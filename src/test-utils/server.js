import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { API_BASE_URL } from '../utils/constants';
import { mockProducts, mockCategories } from './mockData';

/**
 * MSW server for mocking API requests in tests
 */
export const server = setupServer(
  // Mock GET /products/categories (must come before /products/:id to avoid route conflict)
  http.get(`${API_BASE_URL}/products/categories`, () => {
    return HttpResponse.json(mockCategories);
  }),

  // Mock GET /products/category/:category (must come before /products/:id)
  http.get(`${API_BASE_URL}/products/category/:category`, ({ params }) => {
    const { category } = params;
    const filteredProducts = mockProducts.filter(
      (p) => p.category === category
    );
    return HttpResponse.json(filteredProducts);
  }),

  // Mock GET /products
  http.get(`${API_BASE_URL}/products`, () => {
    return HttpResponse.json(mockProducts);
  }),

  // Mock GET /products/:id (must come last to avoid matching /products/categories)
  http.get(`${API_BASE_URL}/products/:id`, ({ params }) => {
    const { id } = params;
    const product = mockProducts.find((p) => p.id === Number(id));
    
    if (product) {
      return HttpResponse.json(product);
    }
    
    return HttpResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  })
);

/**
 * Setup MSW server before all tests
 * Call this in your test files: setupMSW()
 * Note: Since globals are enabled, you can also call these directly in test files
 */
export const setupMSW = () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};

/**
 * Helper to add custom handlers for specific tests
 */
export const addMSWHandler = (handler) => {
  server.use(handler);
};

/**
 * Helper to reset handlers to default
 */
export const resetMSWHandlers = () => {
  server.resetHandlers();
};

