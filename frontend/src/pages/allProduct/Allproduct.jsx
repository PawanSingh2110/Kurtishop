import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../../components/products/ProductCard";
import SortDropdown from "../../components/products/SortDropdown";

const Allproduct = () => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState(""); // For sorting
  const [loading, setLoading] = useState(true); // ✅ Loading state

  const fetchAllProducts = async (sortOption = "") => {
    try {
      setLoading(true); // ✅ Start loading
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/product/filter`,
        {
          params: { sortby: sortOption },
          withCredentials: true,
        }
      );
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  useEffect(() => {
    fetchAllProducts(sortBy);
  }, [sortBy]);

  return (
    <div className="px-4 sm:px-6 md:px-10 text-[#580E0C] ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-20 mb-5 gap-3">
        <h1 className="text-2xl sm:text-3xl md:text-5xl py-10 font-semibold aleo">
          Products
        </h1>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-auto">
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      </div>

      {/* ✅ Show loader until products are ready */}
      {loading ? (
        <div className="flex h-[60vh] flex-col justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} className="w-full">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="text-center h-[60vh] flex justify-center flex-col items-center col-span-full py-10 text-lg">
              No products found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Allproduct;
