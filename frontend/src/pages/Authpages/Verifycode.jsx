import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Error from "../../assets/error.png";
import { toast } from "react-toastify";

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  if (!email) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img className="object-contain h-screen" src={Error} alt="" />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 6) {
      return setError("Please enter a valid 6-digit code.");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/verify-code`,
        { email, code },
        { withCredentials: true }
      );

      const user = res.data.user;
      console.log(user);

      toast.success("Verification successful! Redirecting in 2 seconds...", {
        autoClose: 2000,
      });

      // Show countdown on button
      let countdown = 2;
      const countdownInterval = setInterval(() => {
        setLoading(`Redirecting in ${countdown--}s...`);
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);

        if (user?.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }

        window.location.reload();
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed";
      setError(msg);
      setLoading(false);
      toast.error(msg);
    }
  };

  return (
    <div className="h-screen aleo grid grid-cols-1 lg:grid-cols-2 bg-pink-100">
      {/* Left Image */}
      <div>
        <img
          className="w-full h-screen object-cover hidden lg:block"
          src="https://images.unsplash.com/photo-1597983073512-90bd150e19f6?q=80&w=1974&auto=format&fit=crop"
          alt="Background"
        />
      </div>

      {/* Right Form */}
      <div className="flex items-center justify-center h-screen px-8">
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-white via-pink-50 to-pink-100 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-pink-200"
        >
          <h2 className="text-4xl font-extrabold mb-6 text-center text-[#580e0c] tracking-wide">
            Verify Code
          </h2>

          <p className="text-sm mb-5 text-[#580e0c] text-center">
            We’ve sent a 6-digit verification code to
            <span className="text-red-400 font-semibold"> {email}</span>
          </p>

          <label
            htmlFor="code"
            className="block mb-2 text-lg font-medium text-[#580e0c]"
          >
            Verification Code
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            inputMode="numeric"
            className="w-full border border-[#580e0c] text-[#580e0c] rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#580e0c] text-lg shadow-sm"
            placeholder="123456"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-[#580e0c]" : "bg-[#580e0c]"
            } text-white text-lg font-semibold py-3 rounded-lg transition duration-200 shadow-md`}
          >
            {typeof loading === "string"
              ? loading
              : loading
              ? "Verifying..."
              : "Verify"}
          </button>

          <div className="mt-3 px-2">
            <a
              href="/auth"
              className="aleo text-[#580e0c] whitespace-nowrap text-sm font-medium hover:text-red-400 transition duration-150"
            >
              Use a different email to sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode;
