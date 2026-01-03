import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/slices/favoritesSlice";
import Button from "./ui/Button";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorites.items);

  const isFavorite = useMemo(() => {
    return favorites.some((item) => item.id === product.id);
  }, [favorites, product.id]);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(product));
  };

  const handleViewDetail = (e) => {
    e.preventDefault();
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 relative group flex flex-col justify-between ">
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-2 right-2 z-10 p-2 rounded-full shadow-md transition-colors hover:cursor-pointer ${
          isFavorite
            ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            : "bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
        }`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          className="w-5 h-5"
          fill={isFavorite ? "currentColor" : "none"}
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
      </button>

      <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-4"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-white">
          {product.title}
        </h3>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          ${product.price}
        </p>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {product.rating?.rate || "N/A"} ({product.rating?.count || 0})
          </span>
        </div>

        <p className="  inline-flex items-center  mt-2 px-3 py-1 rounded-full  text-xs font-semibold  capitalize  bg-linear-to-r from-blue-500 to-violet-500   text-white  shadow-sm">
          {product.category}
        </p>
      </div>

      <div className="p-4 pt-0">
        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={handleViewDetail}
        >
          View Detail
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
