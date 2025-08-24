import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";

const Addproduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    stockBySize: [{ size: "", quantity: "" }],
    category: "",
    collection: "",
    image: [null], // Initialize with one empty slot
  });
  const backendURL = import.meta.env.VITE_BACKEND_URL;


const handleChange = (e, index = null) => {
  const { name, value } = e.target;

  if (name === "size" || name === "quantity") {
    const updatedStock = [...formData.stockBySize];
    updatedStock[index][name] =
      name === "quantity" ? Number(value) : value.toUpperCase(); // Uppercase for size
    setFormData((prev) => ({ ...prev, stockBySize: updatedStock }));
  } else if (name === "category") {
    setFormData((prev) => ({ ...prev, category: value.toLowerCase() })); // Lowercase for category
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};


  const addStockSize = () => {
    setFormData((prev) => ({
      ...prev,
      stockBySize: [...prev.stockBySize, { size: "", quantity: "" }],
    }));
  };

  const deleteStockSize = (index) => {
    if (formData.stockBySize.length === 1) return;
    const updatedStock = formData.stockBySize.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, stockBySize: updatedStock }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    const updatedImages = [...formData.image];
    updatedImages[index] = file;
    setFormData((prev) => ({ ...prev, image: updatedImages }));
  };

  const addImageField = () => {
    if (formData.image.length >= 5) return;
    setFormData((prev) => ({
      ...prev,
      image: [...prev.image, null],
    }));
  };

  const deleteImageField = (index) => {
    if (formData.image.length === 1) return;
    const updatedImages = formData.image.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, image: updatedImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submission = new FormData();
      submission.append("title", formData.title);
      submission.append("description", formData.description);
      submission.append("price", formData.price);
      submission.append("discountPrice", formData.discountPrice);
      submission.append("category", formData.category);
      submission.append("collection", formData.collection);
      submission.append("stockBySize", JSON.stringify(formData.stockBySize));
      formData.image.forEach((file) => {
        if (file) submission.append("images", file);
      });

      const res = await axios.post(`${backendURL}/product/create`, submission, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully");

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        discountPrice: "",
        stockBySize: [{ size: "", quantity: "" }],
        category: "",
        collection: "",
        image: [null],
      });

    
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 max-w-4xl mx-auto text-[#580E0C]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-bold mb-4">Add New Product</h2>

        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Product title"
            className="w-full border border-[#580E0C] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#580E0C]"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description"
            rows={4}
            className="w-full p-3 rounded border border-[#580E0C] focus:outline-none focus:ring-2 focus:ring-[#580E0C]"
            required
          />
        </div>

        {/* Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="₹"
              className="w-full p-3 rounded border border-[#580E0C] focus:outline-none focus:ring-2 focus:ring-[#580E0C]"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Discount Price</label>
            <input
              name="discountPrice"
              type="number"
              value={formData.discountPrice}
              onChange={handleChange}
              placeholder="₹"
              className="w-full p-3 rounded border border-[#580E0C] focus:outline-none focus:ring-2 focus:ring-[#580E0C]"
              required
            />
          </div>
        </div>

        {/* Stock By Size */}
        <div>
          <label className="block mb-2 font-medium">Stock by Size</label>
          {formData.stockBySize.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                name="size"
                value={item.size}
                onChange={(e) => handleChange(e, index)}
                placeholder="Size (e.g. M, L, 42)"
                className="flex-1 border border-[#580E0C] w-full p-2 uppercase rounded focus:outline-none focus:ring-2 focus:ring-[#580E0C]"
                required
              />
              
              <input
                name="quantity"
                type="number"
                value={item.quantity}
                onChange={(e) => handleChange(e, index)}
                placeholder="Qty"
                className="flex-1 border border-[#580E0C] w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#580E0C]"
                required
              />
              <button
                type="button"
                onClick={() => deleteStockSize(index)}
                className="text-red-500 hover:text-red-700 flex items-center"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStockSize}
            className="text-blue-600 font-medium mt-2"
          >
            + Add Size
          </button>
        </div>

        {/* Category & Collection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. kurtis, shirts"
              className="w-full lowercase border border-[#580E0C] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#580E0C]"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Collection</label>
            <input
              name="collection"
              value={formData.collection}
              onChange={handleChange}
              placeholder="e.g. summer, festive"
              className="w-full border border-[#580E0C] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#580E0C]"
              required
            />
          </div>
        </div>

        {/* Image Upload (one-by-one with delete) */}
        <div>
          <label className="block mb-2 font-medium">Upload Images (1 by 1)</label>
          {formData.image.map((file, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
                className="border border-[#580E0C] p-2 rounded w-full"
                required
              />
              <button
                type="button"
                onClick={() => deleteImageField(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          {formData.image.length < 5 && (
            <button
              type="button"
              onClick={addImageField}
              className="text-blue-600 font-medium mt-2"
            >
              + Add Another Image
            </button>
          )}
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-[#580E0C] hover:bg-[#4a0a09] text-white w-full px-6 py-3 rounded-lg font-semibold"
          >
            Submit Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default Addproduct;
