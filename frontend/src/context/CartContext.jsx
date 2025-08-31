import { createContext, useContext, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
const [cartVersion, setCartVersion] = useState(0); // 🔁 trigger 
  const refreshCart = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cart/`, {
        withCredentials: true,
      });
      setCartItems(res.data);
      setCartVersion((v) => v + 1); // 🔁 force re-sync across components
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, refreshCart,cartVersion }}>
      {children}
    </CartContext.Provider>
  );
};
