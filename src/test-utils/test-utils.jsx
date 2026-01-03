import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createMockStore } from './mockStore';

/**
 * Custom render function that includes Redux Provider and Router
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @param {Object} options.store - Redux store (optional, creates default if not provided)
 * @param {Object} options.preloadedState - Initial Redux state (optional)
 * @param {Object} options.route - Initial route path (optional, defaults to '/')
 * @param {Object} options.wrapper - Additional wrapper component (optional)
 * @returns {Object} Render result with store and all testing utilities
 */
export const renderWithProviders = (
  ui,
  {
    store = createMockStore(),
    route = '/',
    wrapper: Wrapper,
    ...renderOptions
  } = {}
) => {
  // Set initial route if provided
  if (route !== '/') {
    window.history.pushState({}, 'Test page', route);
  }

  const AllTheProviders = ({ children }) => {
    const content = (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );

    return Wrapper ? <Wrapper>{content}</Wrapper> : content;
  };

  const result = render(ui, {
    wrapper: AllTheProviders,
    ...renderOptions,
  });

  return {
    ...result,
    store,
    rerender: (newUi, newOptions = {}) => {
      const newStore = newOptions.store || store;
      return renderWithProviders(newUi, {
        store: newStore,
        route,
        ...newOptions,
      });
    },
  };
};

/**
 * Render without Redux (for simple component tests)
 */
export const renderWithoutProviders = (ui, options = {}) => {
  return render(ui, options);
};

/**
 * Re-export everything from @testing-library/react
 */
export * from '@testing-library/react';

