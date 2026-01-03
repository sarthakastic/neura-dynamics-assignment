import React from "react";
import { useParams } from "react-router-dom";
import { useProductDetail } from "../hooks/useProductDetail";
import ProductDetailView from "../components/ProductDetailView";
import ProductDetailSkeleton from "../components/skeletons/ProductDetailSkeleton";

const ProductDetail = () => {
  const { id } = useParams();
  const {
    product,
    productLoading,
    productError,
    isFavorite,
    handleToggleFavorite,
  } = useProductDetail(id);

  if (productLoading) {
    return <ProductDetailSkeleton />;
  }

  if (productError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500 dark:text-red-400">
          Error: {productError}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-900 dark:text-white">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <ProductDetailView
      product={product}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
    />
  );
};

export default ProductDetail;
