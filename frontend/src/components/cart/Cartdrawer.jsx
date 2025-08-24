import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import Cartcard from "./Cartcard";
import { useCart } from "../../context/CartContext";
import Cart from "../../assets/cart.png"
import { Link } from "react-router-dom";
const CartDrawer = ({ isOpen, onClose }) => {
  const drawerRef = useRef();
  const { cartItems, refreshCart } = useCart();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
      refreshCart(); // ✅ Load fresh cart when drawer opens
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, refreshCart]);

  const calculateTotal = () =>
    cartItems.reduce(
      (acc, item) => acc + item.discountPrice * item.quantity,
      0
    );

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "bg-black/50 visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        ref={drawerRef}
        className={`absolute top-0 right-0 h-full w-full sm:w-[550px] md:w-[500px] bg-white text-[#580e0c] shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="flex aleo items-center justify-between px-4 py-5 border-b">
          <h2 className="text-2xl font-semibold">Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart">
            <IoClose className="text-2xl sm:text-3xl" />
          </button>
        </div>

       

        {
          cartItems.length > 0 ? (
             <div className="flex-1 overflow-y-auto p-4 text-sm sm:text-base scrollbar-hidden">
          <Cartcard />
        </div>

          ):(
          // ❌ Cart is empty message
          <div className="flex-1 overflow-y-auto p-4 text-sm sm:text-base scrollbar-hidden">
            <img src={Cart} alt="" />
          </div>
        )
        }

        {cartItems.length > 0 ? (
          // ✅ Checkout section when cart has items
          <div className="p-4 border-t border-[#580e0c] text-[#580e0c]">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold poppins">Estimated Price</h1>
              <p className="text-xl poppins">₹ {calculateTotal().toFixed(2)}</p>
            </div>
            <p className="poppins text-sm mt-2">
              Shipping, taxes, and discount codes calculated at checkout
            </p>
            <Link to={"/checkout"} onClick={()=>onClose()}>
            <button  className="relative group w-full overflow-hidden border-2 border-[#580e0c] text-black mt-3">
              <span className="absolute inset-0 bg-[#580e0c] transition-transform duration-300 transform -translate-x-full group-hover:translate-x-0 z-0"></span>
              <span className="relative z-10 block p-3 text-black group-hover:text-white poppins">
                Checkout
              </span>
            </button>
            </Link>
          </div>
        ) : (
          // ❌ Cart is empty message
          <div className="p-6 text-center text-[#580e0c] poppins text-lg font-medium">
            Your cart is empty. Add some products to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
