import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../redux/slices/filtersSlice";
import CategoryButton from "./CategoryButton";

const CategoryFilter = () => {
  const dispatch = useDispatch();
  const { category, productByCategory } = useSelector((state) => state.filters);

  return (
    <div className="flex items-center max-w-full gap-3">
      <svg
        className="w-5 h-5 shrink-0 text-gray-500 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>

      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">
        Categories
      </span>

      <div
        className="
            flex gap-2 flex-nowrap overflow-x-auto
            whitespace-nowrap pr-6
            scrollbar-hide py-2
          "
      >
        <CategoryButton
          active={category === "all"}
          onClick={() => dispatch(setCategory("all"))}
        >
          All
        </CategoryButton>

        {productByCategory?.map((cat) => (
          <CategoryButton
            key={cat}
            active={category === cat}
            onClick={() => dispatch(setCategory(cat))}
          >
            {cat}
          </CategoryButton>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
