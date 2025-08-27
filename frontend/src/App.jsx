import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Auth from "./pages/Authpages/Auth";
import Verifycode from "./pages/Authpages/Verifycode";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProductDetail from "./components/products/ProductDetail.jsx";
import ScrollToTop from "./components/commons/Scroll.jsx";
import Profile from "./pages/User/Profile.jsx";
import Allproduct from "./pages/allProduct/Allproduct.jsx";
import Pooh from "./pages/allProduct/Pooh.jsx";
import Naina from "./pages/allProduct/Naina.jsx";
import Geet from "./pages/allProduct/Geet.jsx";
import Alisha from "./pages/allProduct/Alisha.jsx";
import { CartProvider } from "./context/CartContext";
import { useState, useEffect } from "react";
import CartDrawer from "./components/cart/Cartdrawer.jsx";
import { AdminDashboard } from "./pages/Admin/AdminDashboard.jsx";
import PublicRoute from "./ProtectRoutes/PublicRoute.jsx";
import UserOnlyRoute from "./ProtectRoutes/UserRoutes.jsx";
import AdminOnlyRoute from "./ProtectRoutes/AdminOnlyRoute.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import CheckRoutes from "./ProtectRoutes/ChecKRoutes.jsx";
import PageNotFound from "./pages/allProduct/PageNotFound.jsx";
import Orderdeatils from "./pages/User/Orderdeatils.jsx";

function App() {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fake loader (simulate app initialization)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // 1.2 sec
    return () => clearTimeout(timer);
  }, []);

  const hideNavbarPaths = ["/auth", "/verify-code", "/profile", "/dashboard"];

  const isKnownPath = [
    "/",
    "/product",
    "/category/pooh",
    "/category/naina",
    "/category/geet",
    "/profile",
    "/checkout",
    "/dashboard",
  ].some((path) => location.pathname.startsWith(path));

  const hideNavbar =
    hideNavbarPaths.includes(location.pathname) || !isKnownPath;

  const isHome = location.pathname === "/";

  // ✅ Show Loader first
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className=" text-white aleo text-5xl font font-medium">
          Welcome to Pehrin
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        {!hideNavbar && <Navbar setIsCartOpen={setIsCartOpen} />}

        <div className={`${!hideNavbar ? (isHome ? "mt-0" : "mt-20") : ""}`}>
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <Auth />
                </PublicRoute>
              }
            />
            <Route
              path="/verify-code"
              element={
                <PublicRoute>
                  <Verifycode />
                </PublicRoute>
              }
            />
            <Route
              path="/productdetail/:id"
              element={<ProductDetail setIsCartOpen={setIsCartOpen} />}
            />

            {/* ✅ Product Routes */}
            <Route path="/product" element={<Allproduct />} />
            <Route path="/category/pooh" element={<Pooh />} />
            <Route path="/category/naina" element={<Naina />} />
            <Route path="/category/geet" element={<Geet />} />
            <Route path="/category/aisha" element={<Alisha />} />
            <Route path="*" element={<PageNotFound />} />

            {/* ✅ User Routes */}
            <Route
              path="/profile"
              element={
                <UserOnlyRoute>
                  <Profile />
                </UserOnlyRoute>
              }
            />

            {/* ✅ Checkout + Orders */}
            <Route
              path="/checkout"
              element={
                <CheckRoutes>
                  <Checkout />
                </CheckRoutes>
              }
            />
            <Route
              path="/order-details/:id"
              element={
                <CheckRoutes>
                  <Orderdeatils />
                </CheckRoutes>
              }
            />

            {/* ✅ Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <AdminOnlyRoute>
                  <AdminDashboard />
                </AdminOnlyRoute>
              }
            />
          </Routes>

          {/* ✅ Cart Drawer */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />
        </div>

        {/* Optional Footer */}
{/* ✅ Footer same logic as Navbar */}
{!hideNavbar && <Footer />}
        {/* {!hideNavbar && <Footer />} */}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
