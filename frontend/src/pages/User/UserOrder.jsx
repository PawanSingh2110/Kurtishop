// src/pages/UserOrder.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import order from "../../assets/order.png"
const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/myorders`, {
          withCredentials: true, // ✅ send cookies for auth
        });
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-col h-screen">
        <p className=" aleo text-2xl  font-semibold">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
<img src={order} alt="" className="h-96 flex justify-center" />      </div>
    );
  }

  return (
    <div className="  lg:w-[85vh] xl:w-[90vh] aleo   mx-auto">

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Order ID: <span className="font-medium">{order._id}</span>
              </p>
              <p className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Order Items */}
            <div className="divide-y divide-gray-200">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex items-center py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-700">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="flex justify-between items-center mt-4">
              <p className="font-semibold text-gray-800">
                Total: ₹{order.totalPrice}
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.isPaid ? "Paid" : "Pending"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrder;
