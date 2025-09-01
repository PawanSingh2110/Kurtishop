import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/products/ProductCard";

const Latestsection = () => {
  const [products, setProducts] = useState([]);
// const backendURL = import.meta.env.VITE_BACKEND_URL;
useEffect(() => {
  const fetchLatestProducts = async () => {
    try {
      // Check localStorage first
      const cached = localStorage.getItem("latestProducts");
      if (cached) {
        setProducts(JSON.parse(cached));
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/product/latest`,
        { withCredentials: true }
      );

      setProducts(response.data.latestProducts);

      // Save to localStorage
      console.log(response.data.latestProducts);
    } catch (error) {
      console.error("Error fetching latest products:", error);
    }
  };

  fetchLatestProducts();
}, []);


  return (
    <div className="px-4 lg:px-10">
      <h1 className="text-[#580E0C] font-medium aleo text-4xl md:text-5xl mt-10 text-center">
        Latest <span className="font-light">Arrivals</span>
      </h1>

      <div className="mt-8 overflow-x-auto lg:overflow-x-auto scrollbar-hidden">
        <div className="
          grid grid-cols-1 md:grid-cols-2  gap-6 
          lg:flex lg:gap-4 lg:min-w-max 
        ">
          {products.map((product, index) => (
            <div
              key={index}
              className="w-full lg:min-w-[300px] p-2"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Latestsection;
