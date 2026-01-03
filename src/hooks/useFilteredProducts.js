import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useFilteredProducts = (products) => {
  const { searchQuery, category, sortOrder } = useSelector(
    (state) => state.filters
  );

  const filteredAndSortedProducts = useMemo(() => {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return [];
    }

    let filtered = [...products];

    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (category !== "all") {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (sortOrder === "price-low") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === "price-high") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  }, [products, searchQuery, category, sortOrder]);

  return filteredAndSortedProducts;
};
