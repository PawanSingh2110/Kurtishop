// routes/order.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../authMiddleware");

// Get all orders of logged-in user
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get single order details
router.get("/orders/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
