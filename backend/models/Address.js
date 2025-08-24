const mongoose = require("mongoose");

const Address = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: { type: String }, // shipping / billing
  name: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  pincode: String,
  country: String,
  isDefault: Boolean,
});

module.exports = mongoose.model("Address", Address);
