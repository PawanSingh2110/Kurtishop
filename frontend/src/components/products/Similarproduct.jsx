import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Similarproduct = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get current product ID from URL
  const [similarProducts, setSimilarProducts] = useState([]);
const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await axios.get(`${backendURL}/product/similar/${id}`, {
          withCredentials: true, // if using cookies
        });
        setSimilarProducts(res.data.similarProducts || []);
      } catch (error) {
        console.error("Failed to fetch similar products", error);
      }
    };

    if (id) fetchSimilar();
  }, [id]);

  const handleSimilar = (productId) => {
    navigate(`/productdetail/${productId}`);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="w-[90%] mx-auto z-20 text-[#580e0c]">
      <h1 className="text-2xl  aleo font-medium p-5">You may also like</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4  gap-8">
        {similarProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => handleSimilar(product._id)}
            className="text-center relative hover:shadow-2xl p-2 cursor-pointer"
          >
            {/* SALE TAG */}
            <span className="absolute top-3 left-2 bg-white px-3 py-1 rounded-full text-sm font-medium">
              Sale
            </span>

            {/* IMAGE */}
            <div className="w-full h-[400px] overflow-hidden rounded-sm mx-auto  shadow-md">
              <img
                src={product.image?.[0]}
                alt={product.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* TITLE */}
            <h3 className="mt-3 text-xl aleo font-medium ">
              {product.title}
            </h3>

            {/* PRICING */}
            <div className="mt-1 text-lg poppins">
              <span className="line-through text-gray-500 mr-2">
                Rs. {product.price}.00
              </span>
              <span className=" font-semibold">
                Rs. {product.discountPrice}.00
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Similarproduct;
