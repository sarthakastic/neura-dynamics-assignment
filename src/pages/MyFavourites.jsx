import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/ui/EmptyState";

const MyFavourites = () => {
  const favorites = useSelector((state) => state.favorites.items);

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="My Favourites"
        message="No favorites yet"
        description="Start adding products to your favorites to see them here."
        action={{
          label: "Browse Products",
          to: "/",
        }}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        My Favourites ({favorites.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MyFavourites;
