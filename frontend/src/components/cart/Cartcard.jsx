import React from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
const CartCard = () => {
  const { cartItems, refreshCart } = useCart();


  const updateQuantity = async (id, quantity, maxQty) => {
    if (quantity < 1 || quantity > maxQty) return alert("Invalid quantity");
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/cart/update/${id}`,
        { quantity },
        { withCredentials: true }
      );
      await refreshCart();
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleRemove = async (id) => {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/cart/delete/${id}`, {
      withCredentials: true,
    });
    await refreshCart();
    toast.success("Product removed ");
  };

  return (
    <div className="relative px-2">
      <div className="w-full">
        {cartItems.map((item) => {
          const maxQty =
            item.productId?.stockBySize?.find((s) => s.size === item.size)
              ?.quantity || 0;

          return (
            <div
              key={item._id}
              className="w-full border-b border-gray-400 pb-4 mb-4"
            >
              <div className="flex gap-4 relative">
                {/* Product Image */}
                <img src={item.image} alt={item.title} width={130} />

                {/* Content and Right Side */}
                <div className="flex justify-between w-full">
                  {/* Left content block */}
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg aleo line-clamp-2 w-[80%]">
                      {item.title}
                    </h2>
                    <div className="text-xs poppins">
                      <span className="text-gray-600 line-through mr-3">
                        Rs-{item.price}.00
                      </span>
                      <span className="text-[#580e0c] text-lg font-semibold">
                        Rs-{item.discountPrice}.00
                      </span>
                    </div>
                    <p className="text-lg aleo mt-1">Size: {item.size}</p>

                    {/* Quantity control */}
                    <div className="border-[2px] border-black text-xl poppins w-[80%] mt-4 flex justify-between px-4 py-1 rounded-full">
                      <button
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1, maxQty)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        disabled={item.quantity >= maxQty}
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1, maxQty)
                        }
                        className={`${
                          item.quantity >= maxQty
                            ? "cursor-not-allowed text-gray-400"
                            : "cursor-pointer"
                        }`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Right Side: Total for this item */}
                  <div className="text-right poppins whitespace-nowrap">
                    <p className="text-lg text-gray-800 mt-2">
                      <span className="text-[#580e0c] font-medium">
                        Total: {item.discountPrice * item.quantity}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleRemove(item._id)}
                  className="absolute bottom-2 -right-1 text-xl text-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartCard;
