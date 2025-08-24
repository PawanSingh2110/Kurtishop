import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Addproduct from "./Addproduct";
import Products from "./Products";
import { useAuth } from "../../context/AuthContext";
import AddReviews from "./AddReviews";
import Allreview from "./Allreview";





const Orders = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Orders</h2>
    <p>Orders table or list goes here...</p>
  </div>
);

const Overview = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹2,50,000",
      bg: "bg-green-100",
      text: "text-green-800",
    },
    {
      title: "Total Orders",
      value: "120",
      bg: "bg-blue-100",
      text: "text-blue-800",
    },
    {
      title: "Total Customers",
      value: "85",
      bg: "bg-purple-100",
      text: "text-purple-800",
    },
    {
      title: "Total Products",
      value: "60",
      bg: "bg-orange-100",
      text: "text-orange-800",
    },
  ];

  return (
    <div className="grid gap-6 whitespace-nowrap grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`rounded-xl p-6 shadow-md ${stat.bg} ${stat.text} font-semibold text-center`}
        >
          <h3 className="text-lg mb-2">{stat.title}</h3>
          <p className="text-2xl">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleNavigateShop = () => {
    navigate("/");
  };

  // Tabs to render in sidebar
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "products", label: "Products" },
    { key: "add", label: "Add Product" },
    { key: "allReviews", label: "All Reviews" },
    { key: "addReviews", label: "Add Reviews" },
    { key: "orders", label: "Orders" },
  ];

  return (
    <div className="flex flex-col aleo md:flex-row min-h-screen">
      {/* Top Header (Mobile) */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white z-20 flex items-center gap-2 p-4 shadow-md">
        <button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
          {!isDrawerOpen && <FiMenu className="text-2xl text-black" />}
        </button>
        <h1 className="text-3xl  text-[#580E0C]  font-semibold">
          Admin Dashboard
        </h1>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-30 bg-white p-4 shadow-md h-screen w-3/4 sm:w-2/3 md:w-2/6 lg:w-1/4 transform transition-transform duration-300 ease-in-out
        ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-[#580E0C] font-bold">
              Admin Dashboard
            </h2>
            <div className="md:hidden" onClick={() => setIsDrawerOpen(false)}>
              <FiX className="text-2xl" />
            </div>
          </div>

          <ul className="flex flex-col gap-4">
            {tabs.map((tab) => (
              <li
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setIsDrawerOpen(false);
                }}
                className={`cursor-pointer aleo px-4 py-2 rounded-md capitalize ${
                  activeTab === tab.key
                    ? "bg-[#580E0C] text-white font-semibold text-xl"
                    : "hover:bg-blue-100 text-[#580E0C] text-xl font-semibold"
                }`}
              >
                {tab.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <button
            onClick={handleNavigateShop}
            className="w-full bg-gray-200 text-[#580E0C] hover:bg-gray-300 text-xl py-2 rounded-md font-semibold"
          >
            Shop
          </button>
          <button
            onClick={logout}
            className="w-full bg-red-500 text-xl hover:bg-red-600 text-white py-2 rounded-md font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto mt-16 md:mt-0 p-4 sm:p-6">
        {activeTab === "overview" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <Overview />
          </div>
        )}
        {activeTab === "products" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Products</h2>
            <Products />
          </div>
        )}
        {activeTab === "add" && <Addproduct />}
        {activeTab === "allReviews" && <Allreview />}
        {activeTab === "addReviews" && <AddReviews />}
        {activeTab === "orders" && <Orders />}
      </div>
    </div>
  );
};
