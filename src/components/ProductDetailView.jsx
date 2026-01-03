import React from "react";
import { Link } from "react-router-dom";

const ProductDetailView = ({ product, isFavorite, onToggleFavorite }) => {
  return (
    <div className="container mx-auto px-4 py-8 ">
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Products
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <img
              src={product.image}
              alt={product.title}
              className="max-w-full max-h-96 object-contain"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex-1">
                {product.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-xl">★</span>
              <span className="text-lg text-gray-700 dark:text-gray-300">
                {product.rating?.rate || "N/A"}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                ({product.rating?.count || 0} reviews)
              </span>
            </div>

            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              ${product.price}
            </p>

            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Category:
              </span>
              <p className="text-lg text-gray-900 dark:text-white capitalize ">
                {product.category}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Description:
              </span>
              <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={onToggleFavorite}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors hover:scale-[1.02] hover:cursor-pointer     ${
                  isFavorite
                    ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
                    : " border border-gray-300 dark:border-gray-700 bg-clip-text font-medium transition-all duration-300   hover:bg-linear-to-r hover:from-blue-500 hover:to-violet-500     dark:text-white hover:bg-clip-border "
                }`}
              >
                {isFavorite ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Remove from Favorites
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Add to Favorites
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
