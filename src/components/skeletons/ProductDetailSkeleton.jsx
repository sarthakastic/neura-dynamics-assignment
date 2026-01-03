import React from "react";
import Shimmer from "../ui/Shimmer";

const ProductDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Shimmer height="h-6" width="w-32" rounded="rounded" className="mb-4" />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <Shimmer height="h-96" width="w-full" rounded="rounded-lg" />
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <Shimmer height="h-8" width="w-full" />
                <Shimmer height="h-8" width="w-3/4" />
              </div>
              <Shimmer height="h-10" width="w-10" rounded="rounded-full" />
            </div>

            <div className="flex items-center gap-2">
              <Shimmer height="h-6" width="w-20" />
            </div>

            <Shimmer height="h-12" width="w-32" />

            <div className="space-y-2">
              <Shimmer height="h-4" width="w-20" />
              <Shimmer height="h-6" width="w-24" />
            </div>

            <div className="space-y-2">
              <Shimmer height="h-4" width="w-24" />
              <Shimmer height="h-4" width="w-full" />
              <Shimmer height="h-4" width="w-full" />
              <Shimmer height="h-4" width="w-5/6" />
              <Shimmer height="h-4" width="w-4/6" />
            </div>

            <div className="pt-4">
              <Shimmer height="h-12" width="w-full" rounded="rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
