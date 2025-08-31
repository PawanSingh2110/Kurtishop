import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../../components/products/ProductCard";
import SortDropdown from "../../components/products/SortDropdown";

const Allproduct = () => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState(""); // For sorting

  const fetchAllProducts = async (sortOption = "") => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/product/filter?category=geet`,

        {
          params: { sortby: sortOption },
          withCredentials: true,
        }
      );
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchAllProducts(sortBy);
  }, [sortBy]);

  return (
    <div className="px-4 sm:px-6 md:px-10 text-[#580E0C] ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-20 mb-5 gap-3">
        <h1 className="text-2xl sm:text-3xl md:text-5xl py-10 font-semibold aleo">
          Geet
        </h1>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-auto">
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {products.map((product, index) => (
          <div key={index} className="w-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Allproduct;
