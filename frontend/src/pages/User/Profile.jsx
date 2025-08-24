import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserOrder from "./UserOrder";
import UserInfo from "./UserInfo";
import { FiMenu, FiX } from "react-icons/fi";

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen">
      {/* Top Header for Mobile */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white z-20 flex items-center gap-2 p-4 shadow-md">
        <button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
          {!isDrawerOpen && <FiMenu className="text-2xl text-black" />}
        </button>
        <h1 className="text-2xl font-semibold aleo">My Account</h1>
      </div>

      {/* Sidebar / Drawer */}
      <div
        className={`fixed md:static top-0 left-0 z-30 bg-white p-4 shadow-md h-screen w-3/4 sm:w-2/3 md:w-1/3 lg:w-1/4 transform transition-transform duration-300 ease-in-out
          ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold aleo">My Account</h2>
            <div className="md:hidden" onClick={() => setIsDrawerOpen(false)}>
              <FiX className="text-2xl" />
            </div>
          </div>
          <ul className="flex flex-col gap-4">
            {/* <li
              onClick={() => {
                setActiveTab("profile");
                setIsDrawerOpen(false);
              }}
              className={`cursor-pointer px-4 py-2 rounded-md ${
                activeTab === "profile"
                  ? "bg-[#580E0C] text-white text-xl aleo font-semibold"
                  : "hover:bg-orange-100 text-[#580E0C] text-xl aleo font-semibold"
              }`}
            >
              Profile
            </li> */}
            <li
              onClick={() => {
                setActiveTab("orders");
                setIsDrawerOpen(false);
              }}
              className={`cursor-pointer px-4 py-2 rounded-md ${
                activeTab === "orders"
                  ? "bg-[#580E0C] text-white text-xl aleo font-semibold"
                  : "hover:bg-orange-100 text-[#580E0C] text-xl aleo font-semibold"
              }`}
            >
              My Orders
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <button
            onClick={handleNavigateHome}
            className="w-full bg-gray-200 hover:bg-gray-300 text-[#580E0C] py-2 rounded-md text-xl aleo font-semibold"
          >
            Shop
          </button>
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-xl aleo font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 overflow-y-auto mt-14 md:mt-0 p-4 sm:p-6">
        {activeTab === "profile" && (
          <div className="max-w-3xl">
            <h2 className="text-xl aleo sm:text-2xl font-bold mb-4">
              Profile Information
            </h2>
            <UserInfo />
          </div>
        )}
        {activeTab === "orders" && (
          <div className="max-w-3xl">
            <h2 className="text-xl aleo sm:text-2xl font-bold mb-4">
              My Orders
            </h2>
            <UserOrder />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
