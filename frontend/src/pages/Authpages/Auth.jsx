import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email) {
      setError("Email is required");
      toast.error("Email is required");
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email address");
      toast.error("Enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/request-code`,
        { email }
      );

      toast.success("Verification code sent to your email");
      navigate("/verify-code", { state: { email } });
    } catch (err) {
      const msg = err.response?.data?.message || "Server error";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen aleo bg-pink-100 grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side Image */}
      <div className="hidden lg:block">
        <img
          className="w-full h-screen object-cover"
          src="https://images.unsplash.com/photo-1597983073512-90bd150e19f6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="background"
        />
      </div>

      {/* Right Side Form */}
      <div className="flex relative items-center justify-center h-screen p-6 sm:p-10">
        <a
          href="/"
          className="absolute top-4 left-4 text-[#580e0c] aleo text-lg"
        >
          Home
        </a>
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-md relative">
          <h2 className="text-3xl font-bold mb-4 text-center text-[#580e0c]">
            Sign In
          </h2>

          <label
            htmlFor="email"
            className="block mb-1 font-medium text-lg text-[#580e0c]"
          >
            Email:
          </label>
          <p className="text-[#580e0c] font-medium text-sm mb-2">
            The verification code will be sent to your email
          </p>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#580e0c] rounded-md px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#580e0c]"
            placeholder="you@example.com"
          />

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`relative text-white w-full py-3 border bg-[#580e0c] rounded-md font-semibold overflow-hidden transition-all duration-300 ease-in-out transform group ${
              isSubmitting
                ? "cursor-not-allowed opacity-50"
                : "hover:scale-105"
            }`}
          >
            <span
              className={`relative z-10 transition-colors duration-300 ease-in-out ${
                isSubmitting ? "" : "group-hover:text-white"
              }`}
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </span>

            {/* Animated swipe background */}
            {!isSubmitting && (
              <span className="absolute inset-0 bg-[#cb2c2450] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-in-out z-0" />
            )}

            {/* Optional glowing border on hover */}
            {!isSubmitting && (
              <span className="absolute inset-0 rounded-md group-hover:shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-shadow duration-300 z-0"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
