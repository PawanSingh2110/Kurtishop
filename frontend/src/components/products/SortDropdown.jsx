import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const options = [
  { value: "", label: "Featured" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDsc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

const CustomSortDropdown = ({ sortBy, setSortBy }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value) => {
    setSortBy(value);
    setOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === sortBy)?.label || "Featured";

  return (
    <div className="relative flex  items-center gap-3">
      <p className="text-base font-medium poppins text-gray-700">Sort By:</p>
      <div
        className="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm cursor-pointer flex justify-between items-center min-w-[210px]"
        onClick={() => setOpen(!open)}
      >
        {selectedLabel}
        <FaChevronDown className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {/* <p className="text-md poppins">{totalproduct}products</p> */}
      {open && (
        <div className="absolute top-full right-0 z-10 mt-1 w-[210px] bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="px-4 py-2 hover:bg-orange-100 cursor-pointer transition"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSortDropdown;
