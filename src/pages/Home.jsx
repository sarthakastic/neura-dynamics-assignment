import React, { useEffect } from "react";
import { fetchProducts } from "../redux/slices/productSlice";
import {
  resetFilters,
  fetchProductByCategory,
} from "../redux/slices/filtersSlice";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import SortByPrice from "../components/SortByPrice";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";
import Button from "../components/ui/Button";
import { useFilteredProducts } from "../hooks/useFilteredProducts";

const Home = () => {
  const dispatch = useDispatch();
  const { products, productsLoading, productsError } = useSelector(
    (state) => state.products
  );
  const { searchQuery, category, sortOrder } = useSelector(
    (state) => state.filters
  );
  console.log({ sortOrder });

  const filteredAndSortedProducts = useFilteredProducts(products);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductByCategory());
  }, [dispatch]);

  if (productsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">Discover </span>
            <span className="text-gradient-blue">Amazing </span>
            <span className="text-gradient-violet">Products</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse our curated collection of premium products. Find exactly what
            you're looking for.
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <SearchBar productsCount={0} />

          <div className="flex flex-col lg:flex-row items-start lg:justify-between gap-2">
            <CategoryFilter />
            <SortByPrice />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500 dark:text-red-400">
          Error: {productsError}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          <span className="text-gray-900 dark:text-white">Discover </span>
          <span className="text-gradient-blue">Amazing </span>
          <span className="text-gradient-violet">Products</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 ">
          Browse our curated collection of premium products. Find exactly what
          you're looking for.
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <SearchBar productsCount={filteredAndSortedProducts.length} />

        <div className="flex flex-col flex-wrap lg:flex-row items-start lg:justify-between gap-2 ">
          <CategoryFilter />
          <SortByPrice />
          <Button
            variant="outline"
            size="md"
            fullWidth
            className="lg:w-1/4"
            disabled={
              searchQuery === "" && category === "all" && sortOrder === "none"
            }
            onClick={() => {
              dispatch(resetFilters());
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAndSortedProducts && filteredAndSortedProducts.length > 0 ? (
          filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {!products || products.length === 0
                ? "No products available"
                : searchQuery || category !== "all"
                ? "No products match your filters"
                : "No products found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
