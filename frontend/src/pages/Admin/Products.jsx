import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [editData, setEditData] = useState({
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    stockBySize: [],
    category: "",
    collection: "",
    image: [],
  });

  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${backendURL}/product/filter`, {
        withCredentials: true,
      });
      setProducts(res.data.products || []);
    } catch {
      toast.error("Failed to fetch products");
    }
  };

  const startEditing = (product) => {
    setEditingId(product._id);
    setEditData({ ...product });
    setRemovedImages([]);
    setNewImages([]);
    setShowEditModal(true);
  };

  const handleEditChange = (e, index = null, field = null) => {
    const { name, value } = e.target;
    if (field === "stockBySize") {
      const updated = [...editData.stockBySize];
      updated[index][name] = name === "quantity" ? Number(value) : value;
      setEditData((prev) => ({ ...prev, stockBySize: updated }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageRemove = (url) => {
    setEditData((prev) => ({
      ...prev,
      image: prev.image.filter((img) => img !== url),
    }));
    setRemovedImages((prev) => [...prev, url]);
  };

  const handleNewImagesChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const submitEdit = async () => {
    const formData = new FormData();
    formData.append("title", editData.title);
    formData.append("description", editData.description);
    formData.append("price", editData.price);
    formData.append("discountPrice", editData.discountPrice);
    formData.append("category", editData.category);
    formData.append("collection", editData.collection);
    formData.append("stockBySize", JSON.stringify(editData.stockBySize));
    formData.append("removeImages", JSON.stringify(removedImages));

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await axios.put(
        `${backendURL}/product/update/${editingId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success("Product updated");
      setShowEditModal(false);
      fetchProducts();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${backendURL}/product/del/${deleteId}`, {
        withCredentials: true,
      });
      toast.success("Product deleted");
      setShowDeleteModal(false);
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="overflow-x-auto text-[#580E0C] p-4">
      <table className="min-w-full bg-white border rounded-md">
        <thead>
          <tr className="bg-[#580E0C] text-white text-left">
            <th className="p-3 border">Title</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Discount</th>
            <th className="p-3 border">Category</th>
            <th className="p-3 border">Edit</th>
            <th className="p-3 border">Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod._id} className="border-t hover:bg-gray-50">
              <td className="p-3 border">{prod.title}</td>
              <td className="p-3 border">₹{prod.price}</td>
              <td className="p-3 border">₹{prod.discountPrice}</td>
              <td className="p-3 border">{prod.category}</td>
              <td className="p-3 border">
                <button
                  onClick={() => startEditing(prod)}
                  className="text-green-600 flex items-center gap-1"
                >
                  <FiEdit /> Edit
                </button>
              </td>
              <td className="p-3 border">
                <button
                  onClick={() => confirmDelete(prod._id)}
                  className="text-red-600 flex items-center gap-1"
                >
                  <FiTrash2 /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

            <label className="block mb-1 font-semibold">Title</label>
            <input
              name="title"
              value={editData.title}
              onChange={handleEditChange}
              placeholder="Title"
              className="w-full border p-2 mb-3"
            />

            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              name="description"
              value={editData.description}
              onChange={handleEditChange}
              placeholder="Description"
              className="w-full border p-2 mb-3"
            />

            <div className="flex gap-2 mb-3">
              <div className="w-full">
                <label className="block mb-1 font-semibold">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editData.price}
                  onChange={handleEditChange}
                  placeholder="Price"
                  className="w-full border p-2"
                />
              </div>
              <div className="w-full">
                <label className="block mb-1 font-semibold">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={editData.discountPrice}
                  onChange={handleEditChange}
                  placeholder="Discount"
                  className="w-full border p-2"
                />
              </div>
            </div>

            <h4 className="font-semibold mb-2">Stock by Size</h4>
            {editData.stockBySize.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <div className="w-full">
                  <label className="block mb-1 text-sm">Size</label>
                  <input
                    name="size"
                    value={item.size}
                    onChange={(e) => handleEditChange(e, index, "stockBySize")}
                    placeholder="Size"
                    className="w-full border p-2"
                  />
                </div>
                <div className="w-full">
                  <label className="block mb-1 text-sm">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleEditChange(e, index, "stockBySize")}
                    placeholder="Qty"
                    className="w-full border p-2"
                  />
                </div>
              </div>
            ))}

            <label className="block mb-1 font-semibold mt-3">Category</label>
            <input
              type="text"
              name="category"
              value={editData.category}
              onChange={handleEditChange}
              placeholder="Category"
              className="w-full border p-2 mb-3"
            />

            <label className="block mb-1 font-semibold">Collection</label>
            <input
              type="text"
              name="collection"
              value={editData.collection}
              onChange={handleEditChange}
              placeholder="Collection"
              className="w-full border p-2 mb-3"
            />

            <h4 className="text-lg font-semibold mt-6 mb-2">Existing Images</h4>
            <div className="grid grid-cols-2 gap-3">
              {editData.image.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt={`img-${i}`}
                    className="w-full h-28 object-cover rounded"
                  />
                  <button
                    onClick={() => handleImageRemove(img)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded xl:hidden group-hover:block"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <label className="block mb-1 font-semibold">Add New Images</label>
            <input
              type="file"
              multiple
              onChange={handleNewImagesChange}
              className="w-full border p-2 mb-4"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-400 px-4 py-2 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="bg-green-600 px-4 py-2 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center text-red-600">
              Confirm Deletion
            </h2>
            <p className="mb-4 text-center">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-400 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 px-4 py-2 rounded text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
