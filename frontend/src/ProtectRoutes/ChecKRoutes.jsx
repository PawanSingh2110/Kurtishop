import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CheckRoutes = ({ children }) => {
  const { role, loading } = useAuth();   // ✅ also take loading
  const { cartItems, isLoadingCart } = useCart();
  const location = useLocation();

  const [checked, setChecked] = useState(false);
  const [allowAccess, setAllowAccess] = useState(false);

useEffect(() => {
  if (!loading && !isLoadingCart) {
    if (role !== "user") {
      toast.error("Please log in to continue");
      setAllowAccess(false);
    } else if (
      location.pathname.startsWith("/checkout") &&
      (!cartItems || cartItems.length === 0)
    ) {
      // Only block checkout if cart is empty
      toast.warn("Your cart is empty!");
      setAllowAccess(false);
    } else {
      // Allow for order-details or buy-now flows
      setAllowAccess(true);
    }
    setChecked(true);
  }
}, [role, cartItems, loading, isLoadingCart, location.pathname]);


  // ✅ Show loading spinner until both auth & cart finished loading
  if (loading || isLoadingCart || !checked) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (!allowAccess) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default CheckRoutes;
