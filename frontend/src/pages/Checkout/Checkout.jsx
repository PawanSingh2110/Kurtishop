import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRazorpay } from "react-razorpay";
import { toast } from "react-toastify";

const CheckoutComponent = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(`${backendURL}/cart/`, {
          withCredentials: true,
        });
        setOrderItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.discountPrice * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const indianPhoneRegex = /^[7-9]\d{9}$/;

    if (!formData.firstName || !nameRegex.test(formData.firstName)) {
      newErrors.firstName =
        "First name is required and must contain only letters";
    }
    if (!formData.lastName || !nameRegex.test(formData.lastName)) {
      newErrors.lastName =
        "Last name is required and must contain only letters";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    }
    if (!formData.city) {
      newErrors.city = "City is required";
    }
    if (!formData.postalCode) {
      newErrors.postalCode = "Postal code is required";
    }
    if (!indianPhoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid Indian phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();
  const { Razorpay } = useRazorpay();
const backendURL = import.meta.env.VITE_BACKEND_URL;

  const handlePayment = async () => {
    if (!validate()) return;

    try {
      // Prepare shipping address
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: "India",
      };

      // Convert cart items to checkoutItems
      const checkoutItems = orderItems.map((item) => ({
        productId: item.productId?._id || item.productId,
        name: item.title || item.name,
        image: item.image,
        price: item.discountPrice,
        size: item.size,
        quantity: item.quantity,
      }));

      // 1️⃣ Create order on backend
      const { data } = await axios.post(
        "http://localhost:40001/api/pay",
        { checkoutItems, shippingAddress, totalPrice: subtotal },
        { withCredentials: true }
      );

      const { orderId, amount, currency, key, checkoutId } = data;

      // 2️⃣ Razorpay options
      const options = {
        key,
        amount: amount.toString(),
        currency,
        name: "My Shop",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            // 3️⃣ Verify payment on backend
            const verifyRes = await axios.post(
              `${backendURL}/api/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                checkoutId,
              },
              { withCredentials: true }
            );

            toast.success("Payment verified successfully!");
            navigate(`/order-details/${verifyRes.data.order._id}`, {
              replace: true,
            });
          } catch (err) {
            console.error(
              "❌ Payment verification failed:",
              err.response?.data || err
            );
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: user?.email || "",
          contact: formData.phone,
        },
        theme: { color: "#F37254" },
      };

      // 4️⃣ Open Razorpay checkout
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("🚨 Payment error:", error.response?.data || error);
      alert("Something went wrong while processing payment.");
    }
  };

  return (
    <div className="min-h-[80vh] text-[#580e08] font-medium bg-white aleo flex flex-col lg:flex-row justify-center items-start gap-10 px-4 py-10">
      {/* Left: Checkout Form */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl font-semibold mb-6">CHECKOUT</h2>

        <div className="space-y-8">
          {/* Contact Details */}
          <div>
            <h3 className="font-semibold mb-2">Contact Details</h3>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full border border-[#580e08] px-4 py-2 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Delivery Details */}
          <div>
            <h3 className="font-semibold mb-2">Delivery</h3>
            <div className="flex gap-4 mb-2">
              <div className="w-1/2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-[#580e08] px-4 py-2 rounded-md"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-[#580e08] px-4 py-2 rounded-md"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="mb-2">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-[#580e08] px-4 py-2 rounded-md"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            <div className="flex gap-4 mb-2">
              <div className="w-1/2">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-[#580e08] px-4 py-2 rounded-md"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city}</p>
                )}
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full border border-[#580e08] px-4 py-2 rounded-md"
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm">{errors.postalCode}</p>
                )}
              </div>
            </div>

            <div className="mb-2">
              <input
                type="text"
                value="India"
                readOnly
                className="w-full border border-[#580e08] px-4 py-2 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-[#580e08] px-4 py-2 rounded-md"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handlePayment}
            className="relative group w-full overflow-hidden border-2 border-[#580e0c] text-black mt-3 rounded-md"
          >
            <span className="absolute inset-0 bg-[#580e0c] transition-transform duration-300 transform -translate-x-full group-hover:translate-x-0 z-0"></span>
            <span className="relative z-10 block p-3 text-[#580e0c] group-hover:text-white poppins text-center w-full">
              Pay with Razorpay
            </span>
          </button>
        </div>
      </div>

      {/* Right: Order Summary */}
      <div className="w-full order-first lg:order-last lg:w-2/6 bg-gray-100 p-6 rounded-md shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

        <div className="max-h-[400px] overflow-y-auto scroll-smooth scrollbar-hidden pr-2">
          {orderItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 mb-4 border-b pb-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-25 h-30 object-cover rounded"
              />
              <div className="text-sm flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-gray-500">Size: {item.size}</p>
                <p className="text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold text-sm text-right min-w-[60px]">
                ₹{(item.discountPrice * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 pt-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600">FREE</span>
          </div>
          <div className="flex justify-between font-semibold pt-2">
            <span>Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComponent;
