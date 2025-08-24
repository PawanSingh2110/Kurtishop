// components/SelectSize.jsx
import React from "react";

const SelectSize = ({
  stockBySize,
  selectedSize,
  onSelectSize,
}) => {
  return (
    <div className="space-y-2 aleo">

        <h1 className="aleo text-lg font-medium">
            Select Size
        </h1>
      

      {/* Size buttons */}
      <div className="flex flex-wrap gap-3 mt-2">
        {stockBySize.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelectSize(s.size)}
            disabled={s.quantity === 0}
            className={`border px-4 py-2 rounded-md text-md transition ${
              selectedSize === s.size
                ? "bg-[#580e0c] text-white border-[#580e0c]"
                : "border-gray-300 hover:border-black"
            } ${s.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {s.size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectSize;
