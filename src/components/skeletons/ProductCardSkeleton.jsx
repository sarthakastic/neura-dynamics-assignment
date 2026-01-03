import React from "react";
import Shimmer from "../ui/Shimmer";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="aspect-square w-full bg-gray-100 dark:bg-gray-700">
        <Shimmer
          className="w-full h-full"
          height="h-full"
          rounded="rounded-none"
        />
      </div>

      <div className="p-4 space-y-3">
        <Shimmer height="h-5" width="w-full" />
        <Shimmer height="h-5" width="w-3/4" />

        <Shimmer height="h-8" width="w-24" />

        <div className="flex items-center gap-2">
          <Shimmer height="h-4" width="w-16" />
        </div>

        <Shimmer height="h-6" width="w-20" rounded="rounded-full" />

        <div className="pt-2">
          <Shimmer height="h-10" width="w-full" rounded="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
