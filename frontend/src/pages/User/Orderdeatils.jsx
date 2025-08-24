// src/pages/OrderSummary.jsx
import React, { useEffect, useState } from "react";
import { FaTruck, FaMoneyCheckAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const OrderSummary = () => {
  const { id } = useParams(); // order id from route (e.g. /order/123)
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => {
      navigate("/profile", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `${backendURL}/api/orders/${id}`,
          { withCredentials: true }
        );
        console.log(data);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (error)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-center  text-5xl aleo  font-medium mt-10 text-red-500">
          {error}
        </p>
        ;
      </div>
    );
  if (!order) return null;

  return (
    <div className="min-h-screen aleo flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        {/* ✅ Header */}
        <h1 className="text-3xl font-extrabold text-green-700 text-center mb-6">
          🎉 Thank You for Your Order!
        </h1>

        {/* ✅ Order Info */}
        <div className="flex flex-col md:flex-row shadow-lg justify-between text-sm text-gray-700 mb-6 bg-gray-100 p-4 rounded-lg">
          <div>
            <p>
              <span className="font-semibold">Order ID:</span> {order._id}
            </p>
            <p>
              <span className="font-semibold">Order Date:</span>{" "}
              {new Date(order.orderdate).toLocaleDateString("en-GB")}
              {/* // "en-GB" uses DD/MM/YYYY format */}
            </p>
          </div>
          <div className="text-left md:text-right mt-2 md:mt-0">
            <p className="font-semibold">Estimated Delivery:</p>
            <p className="text-green-600">
              {order.deliveredAt
                ? new Date(order.deliveredAt).toLocaleDateString()
                : "Pending"}
            </p>
          </div>
        </div>

        {/* ✅ Items */}
        <div className="space-y-4">
          {order.orderItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center bg-gray-100 p-4 rounded-lg shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-md object-contain mr-4"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-gray-500 text-sm">Size: {item.size}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹{item.price}</p>
                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Payment & Delivery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Payment */}
          <div className="flex items-start gap-3 bg-gray-100 p-4 rounded-lg shadow-lg">
            <FaMoneyCheckAlt className="text-green-600 text-2xl mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Payment</p>
              <p className="text-gray-600 ">
                {order.paymentMethod} ({order.paymentStatus})
              </p>
            </div>
          </div>

          {/* Delivery */}
          <div className="flex items-start gap-3 bg-gray-100 p-4 rounded-lg shadow-lg">
            <FaTruck className="text-blue-600 text-2xl mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Delivery</p>
              <p className="text-gray-600">{order.shippingAddress.address}</p>
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Footer */}
        <div className="mt-8 text-center">
          <a href="/product">
            <button className="px-6 w-full py-3 bg-[#580e08] text-white rounded-lg shadow transition">
              Continue Shopping
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
