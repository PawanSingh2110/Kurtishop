const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  discountPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  // Removed `stock` and `size` fields
 stockBySize: [
  {
    size: {
      type: mongoose.Schema.Types.Mixed, // e.g., "M", "L", 42
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    _id: false // ✅ this tells Mongoose not to create _id for each item
  }
]
,
  category: {
    type: String,
    required: true,
    default: "",
  },
  collection: {
    type: String,
    required: true,
  },
  image: {
    type: [String],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Product", ProductSchema);
