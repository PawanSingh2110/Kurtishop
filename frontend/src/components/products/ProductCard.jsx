import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group bg-white border-[o.5px] rounded-sm shadow-md hover:shadow-2xl transition-shadow duration-300 p-2 text-[#580e0c]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-sm">
        <img
          src={
            isHovered && product.image[1] ? product.image[1] : product.image[0]
          }
          alt={product.title}
          className="h-[450px] w-full object-cover rounded-sm transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <h2 className=" mt-2 poppins text-center text-lg whitespace-nowrap truncate">
        {product.title}
      </h2>

      <div className="text-center text-base aleo py-2">
        <span className="text-gray-600 line-through mr-3">
          Rs-{product.price}.00
        </span>
        <span className="text-[#580e0c] text-xl font-semibold">
          Rs-{product.discountPrice}.00
        </span>
      </div>

      <button
        onClick={() => navigate(`/productdetail/${product._id}`)}
        className="relative overflow-hidden w-full py-2 text-center poppins text-base border border-[#580e0c] rounded-sm group"
      >
        <span className="relative z-10  group-hover:text-white transition-all duration-300">
          View Details
        </span>
        <span className="absolute left-0 top-0 h-full w-0 bg-[#580e0c] group-hover:w-full transition-all duration-300 ease-in-out z-0"></span>
      </button>
    </div>
  );
};

export default ProductCard;
