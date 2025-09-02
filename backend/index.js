// server.js or index.js
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 40001;

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup (for frontend running on localhost:5173)
app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
  })
);

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// ✅ auth Routes
const authRoutes = require("./routes/auth"); // adjust the path as needed
app.use("/api", authRoutes);
// products routes
const productRoutes = require("./routes/Product.js");
app.use("/product", productRoutes);

//cart itemans
const cartRoutes = require("./routes/CartItem.js");
app.use("/cart", cartRoutes);


const Address = require("./routes/Adress.js");
app.use("/address", Address);


const Review = require("./routes/Review.js");
app.use("/review", Review);

const Checkout= require("./routes/Checkout.js");
app.use("/api", Checkout);

const Order= require("./routes/Order.js");
app.use("/api", Order);

// ✅ Optional: Debug route to inspect cookies
app.get("/api/debug-cookies", (req, res) => {
  console.log("Cookies:", req.cookies);
  res.json(req.cookies);
});
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
