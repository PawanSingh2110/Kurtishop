"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AllReview = () => {
  const [reviews, setReviews] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${backendURL}/review/reviews`);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Open delete modal
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Delete review
  const handleDelete = async () => {
    try {
      await axios.delete(`${backendURL}/review/delete/${deleteId}`);
      setReviews(reviews.filter((rev) => rev._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">All Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-red-900 text-white">
              <tr>
                <th className="py-3 px-4 border">Name</th>
                <th className="py-3 px-4 border">Star</th>
                <th className="py-3 px-4 border">Comment</th>
                {/* <th className="py-3 px-4 border">Edit</th> */}
                <th className="py-3 px-4 border">Delete</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{review.name}</td>
                  <td className="py-2 px-4 border whitespace-nowrap">⭐ {review.star}</td>
                  <td className="py-2 px-4 border">{review.comment}</td>
                  {/* <td className="py-2 px-4 border text-green-600 font-medium cursor-pointer">
                    Edit
                  </td> */}
                  <td className="py-2 px-4 border text-red-600 font-medium cursor-pointer">
                    <span onClick={() => confirmDelete(review._id)}>Delete</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this review?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-1 rounded"
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

export default AllReview;
