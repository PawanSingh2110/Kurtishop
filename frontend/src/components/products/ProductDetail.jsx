import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Pagenotfound from "../commons/Pagenotfound";
import SizeChartModal from "./SizeChartModal";
import SelectSize from "./SelectSize";
import { useAuth } from "../../context/AuthContext";
import Similarproduct from "./Similarproduct";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
const ProductDetail = ({ setIsCartOpen }) => {
  const { id } = useParams();
  const { role,user } = useAuth();
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(null);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { cartVersion } = useCart();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/product/detail/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setProduct(res.data.product);
        const defaultSize = res.data.product.stockBySize.find(
          (s) => s.quantity > 0
        )?.size;
        setSelectedSize(defaultSize || null);
        setMainImage(res.data.product.image[0]);
      })
      .catch((err) => setError(err));
  }, [id]);

  useEffect(() => {
    if (!product || !selectedSize) return;
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/cart`, { withCredentials: true })
      .then((res) => {
        const item = res.data.find(
          (i) => i.productId._id === id && i.size === selectedSize
        );
        setCartQuantity(item ? item.quantity : 0);
      });
  }, [product, selectedSize, id, cartVersion]);

  const handleAddToCart = async () => {
    if (role !== "user") return navigate("/auth");
    const sizeStock = product.stockBySize.find((s) => s.size === selectedSize);
    if (!sizeStock || cartQuantity >= sizeStock.quantity) {
      alert("You cannot add more than available stock.");
      return;
    }
    try {
      setIsAdding(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/cart/add`,
        {
          productId: id,
          size: selectedSize,
          quantity: 1,
        },
        { withCredentials: true }
      );
      setCartQuantity((prev) => prev + 1);
      setIsCartOpen(true);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

 const handleBuyNow = async () => {
  if (role !== "user") return navigate("/auth");
  if (!selectedSize) return setSizeError(true);
  setSizeError(false);

  try {
    if (!product) {
      toast.error("Product not loaded yet");
      return;
    }

    // ✅ avoid name clash → call it buyProduct
    const buyProduct = {
      productId: id,
      name: product.title,           // use title
      image: product.image[0],       // first image
      price: product.discountPrice,  // use discount price for checkout
      size: selectedSize,
      quantity: 1,
    };

    const totalPrice = buyProduct.price * buyProduct.quantity;


    // 1️⃣ Create Razorpay order
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/buy-now`,
      { ...buyProduct, totalPrice, },
      { withCredentials: true }
    );


    // 2️⃣ Open Razorpay checkout
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: "Kurtishop",
      description: "Buy Now Order",
      handler: async function (response) {
        try {
          // 3️⃣ Verify payment
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/buy-now/verify`,
            {
              ...response,
              product: buyProduct,
              totalPrice,
            },
            { withCredentials: true }
          );

          console.log(verifyRes.data.order._id);

          toast.success("Payment verified successfully!");
          
          navigate(`/order-details/${verifyRes.data.order._id}`, {
          
          });
        } catch (err) {
          console.error("Verification failed", err);
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        email: user?.email,
      },
      theme: {
        color: "#F37254",
      },
    };


    const razor = new window.Razorpay(options);
    razor.open();
  } catch (error) {
    console.error("Buy Now Error:", error);
    toast.error("Something went wrong, try again!");
  }
};


  if (error || (!product && error !== null)) return <Pagenotfound />;
  if (!product) return <div className="flex justify-center items-center h-[80vh]"> <div className="text-center text-5xl aleo  py-20">Loading...</div></div>;
  if (error) return <div>Error or Loading...</div>;
  const isOutOfStock = product.stockBySize.every((s) => s.quantity === 0);

  const selectedStock =
    product.stockBySize.find((s) => s.size === selectedSize)?.quantity || 0;
  const isAddDisabled = cartQuantity >= selectedStock || isAdding;

  const startEditing = () => {
    setEditData({ ...product }); // Copy full product
    setShowEditModal(true);
  };

  const handleEditChange = (e, index = null, field = null) => {
    const { name, value } = e.target;
    if (field === "stockBySize") {
      const updated = [...editData.stockBySize];
      updated[index][name] = value;
      setEditData((prev) => ({ ...prev, stockBySize: updated }));
    } else if (field === "image") {
      const updated = [...editData.image];
      updated[index] = value;
      setEditData((prev) => ({ ...prev, image: updated }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
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
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/product/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("Product updated successfully");
      setShowEditModal(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const handleImageRemove = (url) => {
    setEditData((prev) => ({
      ...prev,
      image: prev.image.filter((img) => img !== url),
    }));
    setRemovedImages((prev) => [...prev, url]);
  };
  const handleNewImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

 

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-12 px-6 py-10 max-w-7xl mx-auto text-[#580e0c]">
        {/* LEFT: Product Images */}
        <div className="lg:w-2/3 space-y-4">
          <div className="lg:hidden">
            <img
              src={mainImage}
              alt="Main Product"
              className="w-full object-cover rounded-md max-h-[600px]"
            />
            <div className="flex gap-3 overflow-x-auto mt-3">
              {product.image.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumb ${i}`}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 object-contain rounded-md cursor-pointer border-2 ${
                    mainImage === img
                      ? "border-[#580e0c]"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="hidden lg:block space-y-6">
            {product.image.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Product ${i}`}
                className="w-full object-cover rounded-md max-h-[700px]"
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="lg:w-1/3 relative">
          <div className="sticky top-20 space-y-5">
            <h1 className="text-3xl aleo tracking-wider font-semibold">
              {product.title}
            </h1>

            <div className="text-base poppins tracking-widest">
              <span className="text-gray-600 line-through mr-3">
                Rs-{product.price}.00
              </span>
              <span className="text-[#580e0c] text-xl font-semibold">
                Rs-{product.discountPrice}.00
              </span>
              <p className="text-sm aleo mt-2">Taxes Included</p>
            </div>

            <button
              onClick={() => setShowSizeChart(true)}
              className="text-lg aleo underline"
            >
              Size Chart
            </button>

            <SelectSize
              stockBySize={product.stockBySize}
              selectedSize={selectedSize}
              onSelectSize={(size) => {
                setSelectedSize(size);
                setSizeError(false);
              }}
            />

            {sizeError && (
              <p className="text-red-600 text-sm">Please select a size.</p>
            )}

            <div>
              {role === "admin" ? (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={startEditing}
                    className="relative w-full text-xl font-medium poppins py-3 border border-[#580e0c] rounded group overflow-hidden hover:text-white"
                  >
                    <span className="relative z-10">Edit</span>
                    <span className="absolute inset-0 bg-[#580e0c] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out z-0"></span>
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="relative w-full text-xl font-medium poppins py-3 border border-red-600 text-red-600 rounded group overflow-hidden hover:text-white"
                  >
                    <span className="relative z-10">Delete</span>
                    <span className="absolute inset-0 bg-red-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out z-0"></span>
                  </button>
                </div>
              ) : (
                <div className="poppins text-lg flex flex-col gap-3">
                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddDisabled}
                    className={`relative w-full py-3 border border-[#580e0c] rounded group overflow-hidden ${
                      isAddDisabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">
                      {isAddDisabled
                        ? cartQuantity >= selectedStock
                          ? "Max limit reached"
                          : "Adding..."
                        : "Add to Cart"}
                    </span>
                    {!isAddDisabled && (
                      <span className="absolute inset-0 bg-[#580e0c] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out z-0"></span>
                    )}
                  </button>

                  {/* Buy It Now */}
                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`relative w-full py-3 border border-[#580e0c] rounded group overflow-hidden ${
                      isOutOfStock
                        ? "cursor-not-allowed opacity-50"
                        : "hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">Buy It Now</span>
                    {!isOutOfStock && (
                      <span className="absolute inset-0 bg-[#580e0c] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out z-0"></span>
                    )}
                  </button>
                </div>
              )}
            </div>
            {/* deiting in product detail */}
            {showEditModal && (
              <div className="fixed inset-0 aleo bg-black/30 h-screen bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[70vh] overflow-y-auto text-[#580e0c]">
                  <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>

                  {/* Title */}
                  <label className="block mb-1 font-medium">Title</label>
                  <input
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-[#580e0c] focus:ring-2 focus:ring-[#580e0c] rounded mb-4"
                    placeholder="Title"
                  />

                  {/* Description */}
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-[#580e0c] focus:ring-2 focus:ring-[#580e0c] rounded mb-4"
                    placeholder="Description"
                  />

                  {/* Price */}
                  <label className="block mb-1 font-medium">Price</label>
                  <input
                    name="price"
                    type="number"
                    value={editData.price}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-[#580e0c] focus:ring-2 focus:ring-[#580e0c] rounded mb-4"
                    placeholder="Price"
                  />

                  {/* Discount Price */}
                  <label className="block mb-1 font-medium">
                    Discount Price
                  </label>
                  <input
                    name="discountPrice"
                    type="number"
                    value={editData.discountPrice}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-[#580e0c] focus:ring-2 focus:ring-[#580e0c] rounded mb-4"
                    placeholder="Discount Price"
                  />

                  {/* Category */}
                  <label className="block mb-1 font-medium">Category</label>
                  <input
                    name="category"
                    value={editData.category}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-[#580e0c] focus:ring-2 focus:ring-[#580e0c] rounded mb-4"
                    placeholder="Category"
                  />

                  {/* Collection */}
                  <label className="block mb-1 font-medium">Collection</label>
                  <input
                    name="collection"
                    value={editData.collection}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-[#580e0c] focus:ring-2 focus:ring-[#580e0c] rounded mb-4"
                    placeholder="Collection"
                  />

                  {/* Stock By Size */}
                  <h4 className="text-lg font-semibold mt-6 mb-2">
                    Stock By Size
                  </h4>
                  {editData.stockBySize.map((item, i) => (
                    <div key={i} className="flex gap-4 mb-3">
                      <div className="flex-1">
                        <label className="block mb-1 font-medium">Size</label>
                        <input
                          name="size"
                          value={item.size}
                          onChange={(e) =>
                            handleEditChange(e, i, "stockBySize")
                          }
                          className="w-full p-2 border border-[#580e0c] focus:ring-2 focus:ring-[#580e0c] rounded"
                          placeholder="Size"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block mb-1 font-medium">
                          Quantity
                        </label>
                        <input
                          name="quantity"
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleEditChange(e, i, "stockBySize")
                          }
                          className="w-full p-2 border border-[#580e0c] focus:ring-2 focus:ring-[#580e0c] rounded"
                          placeholder="Quantity"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Images */}
                  <h4 className="text-lg font-semibold mt-6 mb-2">
                    Existing Images
                  </h4>
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
                  <div className="mt-4">
                    <label className="block font-medium mb-1">
                      Add New Images
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleNewImageChange}
                      className="block w-full border p-2 rounded"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 border border-[#580e0c] text-[#580e0c] hover:bg-[#580e0c] hover:text-white rounded transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitEdit}
                      className="px-4 py-2 bg-[#580e0c] text-white rounded hover:bg-[#40110c]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showDeleteModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md text-center text-[#580e0c]">
                  <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                  <p className="mb-6">
                    Are you sure you want to delete this product?
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 border border-[#580e0c] rounded hover:bg-[#580e0c] hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await axios.delete(
                            `${import.meta.env.VITE_BACKEND_URL}/product/del/${id}`,
                            {
                              withCredentials: true,
                            }
                          );
                          toast.success("Product deleted successfully");
                          navigate("/");
                        } catch (err) {
                          toast.error("Failed to delete product");
                        } finally {
                          setShowDeleteModal(false);
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            <p className="text-lg tracking-wider aleo">{product.description}</p>
          </div>
        </div>
      </div>

      <Similarproduct />

      <SizeChartModal
        show={showSizeChart}
        onClose={() => setShowSizeChart(false)}
      />
    </>
  );
};

export default ProductDetail;
