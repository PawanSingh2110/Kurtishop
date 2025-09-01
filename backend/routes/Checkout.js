// routes/checkout.js
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Checkout = require("../models/Checkout");
const CartItem = require("../models/Cart"); // adjust path
const nodemailer = require("nodemailer");
const { protect } = require("../authMiddleware");
const Order = require("../models/Order"); // ✅ import new Order model
// Razorpay instance (test keys)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- CREATE ORDER ---
router.post("/pay", protect, async (req, res) => {
  try {
    const { checkoutItems, shippingAddress, totalPrice } = req.body;

    if (!checkoutItems || checkoutItems.length === 0)
      return res.status(400).json({ message: "No items in checkout" });

    if (!totalPrice || totalPrice <= 0)
      return res.status(400).json({ message: "Invalid total price" });

    // Save checkout record
    const checkout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      totalPrice,
      isPaid: false,
      paymentStatus: "pending",
    });

    // Razorpay order (amount in paise)
    const options = {
      amount: Math.round(totalPrice * 100),
      currency: "INR",
      receipt: `order_rcptid_${checkout._id}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      checkoutId: checkout._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Checkout failed" });
  }
});

router.post("/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      checkoutId,
    } = req.body;

    console.log("Verify body:", req.body);

    // 1️⃣ Check if checkout exists
    const checkoutExists = await Checkout.findById(checkoutId);
    if (!checkoutExists)
      return res.status(404).json({ message: "Checkout not found" });

    // 2️⃣ Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ message: "Invalid payment signature" });

    // 3️⃣ Update Checkout
    const checkout = await Checkout.findByIdAndUpdate(
      checkoutId,
      {
        isPaid: true,
        paidAt: new Date(),
        paymentStatus: "paid",
        isFinalized: true,
        paymentDetails: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
      },
      { new: true }
    );

    // 4️⃣ Create Order from checkout
    const order = await Order.create({
      user: req.user._id,
      orderItems: checkout.checkoutItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
      })),
      shippingAddress: checkout.shippingAddress,
      paymentMethod: "Razorpay",
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paidAt: new Date(),
      orderdate: new Date(),
      paymentStatus: "paid",
      status: "Processing",
    });

    // 5️⃣ Empty Cart for this user
    await CartItem.deleteMany({ userId: req.user._id });

    // 6️⃣ Send Confirmation Email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or smtp
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your password or app password
      },
    });

    const mailOptions = {
      from: `"Kurtishop" <${process.env.EMAIL_USER}>`,
      to: req.user.email, // user email from protect middleware
      subject: "Order Confirmation",
      html: `
        <h2>Thank you for your order!</h2>
        <p>Hi ${req.user.name},</p>
        <p>Your order <b>${order._id}</b> has been successfully placed.</p>
        <p><b>Total:</b> ₹${order.totalPrice}</p>
        <p><b>Status:</b> ${order.status}</p>
        <h3>Order Items:</h3>
        <ul>
          ${order.orderItems
            .map(
              (item) =>
                `<li>${item.name} (${item.size}) - ${item.quantity} × ₹${item.price}</li>`
            )
            .join("")}
        </ul>
        <p>It will be delivered to: <br/>${order.shippingAddress.address}, ${
        order.shippingAddress.city
      }, ${order.shippingAddress.postalCode}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // 7️⃣ Respond
    res.json({
      message: "Payment verified, order created, cart cleared & email sent",
      checkout,
      order,
    });
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

// --- BUY NOW (Create Order without shippingAddress) ---
router.post("/buy-now", protect, async (req, res) => {
  try {
    const { productId, name, image, price, size, quantity, totalPrice } =
      req.body;

    if (!productId || !price || !quantity)
      return res.status(400).json({ message: "Missing product details" });

    // Razorpay order (amount in paise)
    const options = {
      amount: Math.round(totalPrice * 100),
      currency: "INR",
      receipt: `buy_now_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      product: { productId, name, image, price, size, quantity },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Buy Now Error:", error);
    res.status(500).json({ message: "Buy Now checkout failed" });
  }
});

// --- BUY NOW VERIFY ---
router.post("/buy-now/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      product, // product details from frontend
      totalPrice,
    } = req.body;

    // 1️⃣ Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // 2️⃣ Create Order
    const order = await Order.create({
      user: req.user._id,
      orderItems: [
        {
          productId: product.productId,
          name: product.name,
          image: product.image,
          price: product.price,
          size: product.size,
          quantity: product.quantity,
        },
      ],
      shippingAddress: {
        address: "N/A",
        city: "N/A",
        postalCode: "000000",
        country: "N/A",
      },
      paymentMethod: "Razorpay",
      totalPrice,
      isPaid: true,
      orderdate: new Date(),
      paidAt: new Date(),
      paymentStatus: "paid",
      status: "Processing",
      isBuyNow: true,
    });

    // 3️⃣ Send Confirmation Email (won’t break if fails)
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"Kurtishop" <${process.env.EMAIL_USER}>`,
        to: req.user.email,
        subject: "Order Confirmation (Buy Now)",
        html: `
          <h2>Thank you for your purchase!</h2>
          <p>Hi ${req.user.name},</p>
          <p>Your order <b>${order._id}</b> has been successfully placed.</p>
          <p><b>Total:</b> ₹${order.totalPrice}</p>
          <p><b>Status:</b> ${order.status}</p>
          <h3>Item:</h3>
          <ul>
            <li>${product.name} (${product.size}) - ${product.quantity} × ₹${product.price}</li>
          </ul>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
    }

    // 4️⃣ Respond (frontend needs order._id for navigation)
    res.status(200).json({
      success: true,
      message: "Buy Now payment verified, order created",
      order,
    });
  } catch (error) {
    console.error("Buy Now Verify Error:", error);
    res.status(500).json({ message: "Buy Now payment verification failed" });
  }
});

module.exports = router;
