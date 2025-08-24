import React, { useState, useEffect } from "react";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const MenuSlider = ({ isOpen, onClose }) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const router = useNavigate();

  const { role } = useAuth();

  const links = [
    { name: "Home", path: "/" },
    { name: "Product", path: "/product" },
    {
      name: "Category",
      children: [
        { name: "Pooh", path: "/category/pooh" },
        { name: "Naina", path: "/category/naina" },
        { name: "Geet", path: "/category/geet" },
        { name: "Aisha", path: "/category/aisha" },
      ],
    },
    { name: "ContactUs", path: "/contactus" },
  ];

  useEffect(() => {
    if (!isOpen) setCategoryOpen(false);
  }, [isOpen]);

  const handleNavigation = (path) => {
    onClose();
    router(path); // ✅ Correct for react-router-dom's useNavigate()
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } bg-black/15 bg-opacity-90`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white aleo text-[#580e0c] shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col justify-between`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-3xl font-bold">Menu</h2>
            <button onClick={onClose}>
              <IoIosArrowBack size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="p-4 space-y-4 text-xl">
            {links.map((item, idx) =>
              item.children ? (
                <li key={idx}>
                  <button
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    className="flex text-2xl justify-between items-center w-full hover:text-[#580e0ce4] transition"
                  >
                    <span className="relative group ">
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <IoIosArrowDown
                      className={`transition-transform duration-300 ${
                        categoryOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      categoryOpen
                        ? "max-h-60 opacity-100 mt-2"
                        : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <ul className="pl-4 space-y-2  border-gray-700">
                      {item.children.map((sub, subIdx) => (
                        <li
                          key={subIdx}
                          className="flex items-center justify-between py-1 px-3 rounded-r-md hover:bg-gray-400 transition group cursor-pointer"
                          onClick={() => handleNavigation(sub.path)}
                        >
                          <span>{sub.name}</span>
                          <IoIosArrowForward className="text-black opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li
                  key={idx}
                  className="cursor-pointer hover:text-[#580e0c] font-medium text-2xl transition relative group"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Footer with Account / Login / Admin */}
        <div className="p-4 border-t border-[#580e0c]">
          <button
            onClick={() => {
              if (!role) {
                handleNavigation("/auth");
              } else if (role === "user") {
                handleNavigation("/profile");
              } else if (role === "admin") {
                handleNavigation("/dashboard");
              }
            }}
            className="w-full text-xl flex items-center gap-2 text-[#580e0c]  transition"
          >
            <FaRegUser className="text-xl" />
            <span>
              {role === "admin"
                ? "Admin Panel"
                : role === "user"
                ? "My Profile"
                : "Login"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuSlider;
