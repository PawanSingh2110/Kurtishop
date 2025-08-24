const express = require("express");
const router = express.Router();
const CartItem = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../authMiddleware");

// ✅ Get all cart items with stockBySize populated from Product
router.get("/", protect, async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user.id })
      .populate("productId", "stockBySize"); // only get stockBySize from product
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Add item to cart
router.post("/add", protect, async (req, res) => {
  const { productId, size, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const sizeStock = product.stockBySize.find((s) => s.size === size);
    if (!sizeStock) {
      return res.status(400).json({ message: `Size ${size} not available` });
    }

    const existingItem = await CartItem.findOne({
      userId: req.user.id,
      productId,
      size,
    });

    const availableQty = sizeStock.quantity;

    if (existingItem) {
      const totalRequestedQty = existingItem.quantity + quantity;

      if (totalRequestedQty > availableQty) {
        return res.status(400).json({
          message: `Only ${availableQty} items available for size ${size}`,
        });
      }

      existingItem.quantity = totalRequestedQty;
      await existingItem.save();

      return res.json(existingItem);
    }

    if (quantity > availableQty) {
      return res.status(400).json({
        message: `Only ${availableQty} items available for size ${size}`,
      });
    }

    const newCartItem = new CartItem({
      userId: req.user.id,
      productId,
      title: product.title,
      size,
      image: product.image[0],
      price: product.price,
      discountPrice: product.discountPrice,
      quantity,
    });

    await newCartItem.save();
    res.status(201).json(newCartItem);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});




// ✅ Update quantity
router.put("/update/:id", protect, async (req, res) => {
  const { quantity } = req.body;

  try {
    const cartItem = await CartItem.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    const product = await Product.findById(cartItem.productId);
    const sizeStock = product.stockBySize.find((s) => s.size === cartItem.size);

    if (!sizeStock) {
      return res.status(400).json({ message: `Size ${cartItem.size} not available` });
    }

    if (quantity > sizeStock.quantity) {
      return res.status(400).json({
        message: `Only ${sizeStock.quantity} items available for size ${cartItem.size}`,
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    console.error("Cart update error:", err);
    res.status(500).json({ message: "Failed to update cart item" });
  }
});


// ✅ Delete item
router.delete("/delete/:id", protect, async (req, res) => {
  try {
    const deleted = await CartItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Cart item not found" });
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
});

module.exports = router;
