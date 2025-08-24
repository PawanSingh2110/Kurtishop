const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const { protect,adminOnly } = require("../authMiddleware");



router.post("/add",protect,adminOnly, async (req, res) => {
  try {
    const { name, star, comment } = req.body;

    // ✅ validate
    if (!name || !star || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ create review
    const newReview = new Review({
      name,
      star,
      comment,
    });

    // ✅ save to DB
    await newReview.save();

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete/:id",protect,adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



router.put("/update/:id", protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params; // ID of the review to update
    const { name, star, comment } = req.body; // Fields to update

    // ✅ Validate input
    if (!name && !star && !comment) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }

    // ✅ Find the review by ID
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // ✅ Update fields
    if (name) review.name = name;
    if (star) review.star = star;
    if (comment) review.comment = comment;

    // ✅ Save updated review
    const updatedReview = await review.save();

    res.status(200).json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating review", error: error.message });
  }
});



router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 }) // recent first
      .limit(9);               // only 9 reviews
    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
});




module.exports = router;