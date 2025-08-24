import React, { useState, useRef, useEffect } from "react";
import { FaRegUser } from "react-icons/fa6";
import { IoBagHandle } from "react-icons/io5";
import { IoIosSearch, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { GrMenu } from "react-icons/gr";
import MenuSlider from "./commons/Menuslider";
import SearchDrawer from "./commons/SearchDrawer";
import Cartdrawer from "./cart/Cartdrawer";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Make sure this is imported
import CartDrawer from "./cart/Cartdrawer";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { role } = useAuth();
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const handleUserClick = () => {
    if (!role) {
      navigate("/auth");
    } else if (role === "user") {
      navigate("/profile");
    } else if (role === "admin") {
      navigate("/dashboard");
    }
  };

  const dropdownRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle scroll for background color change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Clean up
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const location = useLocation();
  const isHome = location.pathname === "/";

  const links = [
    { name: "Pooh", path: "/category/pooh" },
    { name: "Naina", path: "/category/naina" },
    { name: "Geet", path: "/category/geet" },
    { name: "Aisha", path: "/category/aisha" },
  ];

  return (
    <>
      <div
        className={`fixed top-0 inset-x-0 z-50 px-8 py-4 flex justify-between items-center transition-colors duration-300 
    ${
      isHome
        ? isScrolled
          ? "bg-[#580E0C]/80 text-white"
          : "bg-transparent text-white"
        : "bg-white text-[#580E0C] shadow-md "
    }`}
      >
        {/* Left Side */}
        <div className="flex items-center gap-10 poppins text-lg">
          <div className="flex gap-3 justify-center items-center">
            <GrMenu
              className="text-xl lg:hidden cursor-pointer"
              onClick={() => setDrawerOpen(true)}
            />
            <a href="/" className="text-4xl aleo font-bold">
              Pehrin_
            </a>
          </div>
          <ul className="hidden lg:flex items-center gap-6">
            <li className="group relative cursor-pointer">
              <a href="/"> Home</a>
              <span
                className={`absolute left-0 -bottom-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full ${
                  isHome ? "bg-white" : "bg-black"
                }`}
              ></span>
            </li>
            <li className="group relative cursor-pointer">
              <a href="/product">All Product</a>
              <span
                className={`absolute left-0 -bottom-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full ${
                  isHome ? "bg-white" : "bg-black"
                }`}
              ></span>
            </li>

            {/* Category Dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="group flex items-center gap-1 cursor-pointer relative"
              >
                <span>
                  Category
                  <span
                    className={`absolute left-0 -bottom-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full ${
                      isHome ? "bg-white" : "bg-black"
                    }`}
                  ></span>
                </span>
                <IoIosArrowDown
                  className={`transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              <div
                className={`absolute left-0 mt-2 w-60 bg-white text-[#580E0C]  shadow-lg rounded-md z-50 transform transition-all duration-300 origin-top ${
                  dropdownOpen
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible"
                }`}
              >
                <ul className="py-2">
                  {links.map((item, idx) => (
                    <li key={idx} className="hover:bg-gray-100">
                      <Link
                        to={item.path}
                        onClick={() => setDropdownOpen(false)}
                        className="group px-4 py-2 cursor-pointer flex items-center justify-between"
                      >
                        <span>{item.name}</span>
                        <IoIosArrowForward className="text-gray-500 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li className="group relative cursor-pointer">
              ContactUs
              <span
                className={`absolute left-0 -bottom-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full ${
                  isHome ? "bg-white" : "bg-black"
                }`}
              ></span>
            </li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5 text-2xl">
          {/* <IoIosSearch
            className="cursor-pointer"
            onClick={() => setIsSearchOpen(true)}
          /> */}
          <FaRegUser
            className="cursor-pointer hidden lg:block"
            onClick={handleUserClick}
          />{" "}
          {role !== "admin" && (
            <div className="relative">
              <IoBagHandle
                className="cursor-pointer"
                onClick={() => setIsCartOpen(true)}
              />
              {cartItems.length > 0 && (
                <p className="absolute top-0 -right-1 text-[10px] p-[1px] bg-[#580e0c] border-white border-[2px] text-center text-white rounded-full w-4">
                  {cartItems.length}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Menu Slider */}
      <MenuSlider isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      {/* search bar */}
      {/* <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      /> */}
      {/* cart item */}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
