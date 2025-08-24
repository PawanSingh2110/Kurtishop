const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    
  },
  {
    timestamps: true,
    id:false,
  }
);

// Virtual field for total price
CartItemSchema.virtual("totalPrice").get(function () {
  return this.discountPrice * this.quantity;
});

CartItemSchema.set("toJSON", { virtuals: true });
CartItemSchema.set("toObject", { virtuals: true });
CartItemSchema.index({ userId: 1, productId: 1, size: 1 }, { unique: true })

module.exports = mongoose.model("CartItem", CartItemSchema);
