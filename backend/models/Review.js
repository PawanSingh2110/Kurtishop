const mongoose = require("mongoose");

const ProductReviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // ⭐ usually between 1–5
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductReview", ProductReviewSchema);
