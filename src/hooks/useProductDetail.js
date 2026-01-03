import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../redux/slices/productSlice";
import { toggleFavorite } from "../redux/slices/favoritesSlice";

export const useProductDetail = (productId) => {
  const dispatch = useDispatch();
  const { product, productLoading, productError } = useSelector(
    (state) => state.products
  );
  const favorites = useSelector((state) => state.favorites.items);

  const isFavorite = useMemo(() => {
    return product ? favorites.some((item) => item.id === product.id) : false;
  }, [product, favorites]);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [productId, dispatch]);

  const handleToggleFavorite = () => {
    if (product) {
      dispatch(toggleFavorite(product));
    }
  };

  return {
    product,
    productLoading,
    productError,
    isFavorite,
    handleToggleFavorite,
  };
};
