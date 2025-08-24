import React, { useState } from "react";
import axios from "axios";

const AddReviews = () => {
  const [formData, setFormData] = useState({
    name: "",
    star: "",
    comment: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.star || formData.star < 1 || formData.star > 5)
      newErrors.star = "Stars must be between 1 and 5";
    if (!formData.comment.trim() || formData.comment.length < 5)
      newErrors.comment = "Comment must be at least 5 characters long";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const backendURL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(
        `${backendURL}/review/add`,
        formData,
        {
          withCredentials:true // 👈 send token
        }
      );
      setMessage(res.data.message);
      setFormData({ name: "", star: "", comment: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding review");
    }
  };

  return (
    <div className="max-w-md aleo mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl text-[#580e0c] font-bold mb-4">Add Review</h2>
      {message && <p className="text-center text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border-[#580e08] border-2 p-2 rounded"
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
        <input
          type="number"
          name="star"
          min="1"
          max="5"
          placeholder="Stars (1–5)"
          value={formData.star}
          onChange={handleChange}
          className="w-full border-[#580e08] border-2 p-2 rounded"
        />
        {errors.star && <p className="text-red-500">{errors.star}</p>}
        <textarea
          name="comment"
          placeholder="Comment"
          value={formData.comment}
          onChange={handleChange}
          className="w-full border-[#580e08] border-2 p-2 rounded"
          rows="4"
        />
        {errors.comment && <p className="text-red-500">{errors.comment}</p>}
        <button
          type="submit"
          className="w-full bg-[#580e0c] text-white p-2 rounded"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default AddReviews;
