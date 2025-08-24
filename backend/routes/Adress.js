const express = require("express");
const router = express.Router();
const Address = require("../models/Address");
const { protect, adminOnly } = require("../authMiddleware");

// POST /api/user/add-ress
router.post("/add-ress", protect, async (req, res) => {
  try {
    const {
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      isDefault,
    } = req.body;
    const user = req.user.id;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newAddress = new Address({
      userId: user,
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      isDefault: isDefault || false,
    });

    await newAddress.save();
    res
      .status(201)
      .json({ success: true, message: "Address added", address: newAddress });
  } catch (error) {
    console.error("Error adding address:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/get-address", protect, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.put("/update-address", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the first address that matches the userId
    const address = await Address.findOne({ userId });

    if (!address) {
      return res.status(404).json({ message: "Address not found for this user." });
    }

    // Destructure fields from the request body
    const {
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      country,
      isDefault,
    } = req.body;

    // Conditionally update fields
    if (name) address.name = name;
    if (phone) address.phone = phone;
    if (addressLine1) address.addressLine1 = addressLine1;
    if (addressLine2) address.addressLine2 = addressLine2;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;
    if (country) address.country = country;
    if (isDefault !== undefined) address.isDefault = isDefault;

    const updatedAddress = await address.save();

    res.status(200).json({
      success: true,
      message: "✅ Address updated successfully",
      updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address by userId:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
