import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSortOrder } from "../redux/slices/filtersSlice";

const options = [
  { value: "none", label: "Default" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
];

const SortByPrice = () => {
  const dispatch = useDispatch();
  const { sortOrder } = useSelector((state) => state.filters);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected =
    options.find((o) => o.value === sortOrder)?.label || "Sort by Price";

  return (
    <div className="flex items-center gap-3  " ref={ref}>
      <svg
        className="w-5 h-5 text-gray-500 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
        />
      </svg>

      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">
        Sort by
      </span>

      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="
            h-9 px-4 min-w-[180px]
            flex items-center justify-between gap-2
            rounded-lg
            bg-gray-200 text-gray-700
            dark:bg-gray-700 dark:text-gray-300
            text-sm font-medium
            hover:bg-gray-300 dark:hover:bg-gray-600
            focus:outline-none focus:ring-2 focus:ring-blue-500/40
          "
        >
          <span className="truncate">{selected}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {open && (
          <div
            className="
              absolute right-0 mt-2 w-full
              rounded-lg
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              shadow-lg
              z-20
              overflow-hidden
            "
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  dispatch(setSortOrder(option.value));
                  setOpen(false);
                }}
                className={`
                  w-full px-4 py-2 text-left
                  text-sm
                  transition-colors
                  ${
                    sortOrder === option.value
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SortByPrice;
