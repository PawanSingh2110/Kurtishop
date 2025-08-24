const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect,adminOnly } = require("../authMiddleware");
const { upload, cloudinary } = require("../cloudinary");
const mongoose = require("mongoose");

router.post(
  "/create",
  protect,
  upload.array("images", 5), // up to 5 images
  async (req, res) => {
    try {
      const user = req.user.id;
      const {
        title,
        description,
        price,
        discountPrice,
        stockBySize,
        category,
        collection,
      } = req.body;

      if (
        !title ||
        !description ||
        price == null ||
        discountPrice == null ||
        !stockBySize ||
        !category ||
        !collection ||
        !req.files ||
        req.files.length === 0
      ) {
        return res.status(400).json({ message: "All fields are required." });
      }

      let parsedStock;
      try {
        parsedStock = JSON.parse(stockBySize);
        if (!Array.isArray(parsedStock)) throw new Error();
      } catch {
        return res
          .status(400)
          .json({ message: "stockBySize must be a JSON array." });
      }

      for (const entry of parsedStock) {
        if (
          !entry.size ||
          entry.quantity == null ||
          typeof entry.quantity !== "number"
        ) {
          return res
            .status(400)
            .json({ message: "Each size entry must have size and quantity." });
        }
      }

      const imageUrls = req.files.map((file) => file.path); // Cloudinary gives back `path`

      const product = new Product({
        title,
        description,
        price,
        discountPrice,
        stockBySize: parsedStock,
        category,
        collection,
        image: imageUrls,
        user,
      });

      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
      console.log("Cloudinary Key:", process.env.CLOUDINARY_API_KEY);
    } catch (err) {
      console.error("Product creation error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

//add admin after ttesting
// UPDATE PRODUCT — Add/remove images from DB and Cloudinary
router.put(
  "/update/:id",
  protect,
  adminOnly,
  upload.array("images", 5), // Upload new images (optional)
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found." });

      const {
        title,
        description,
        price,
        discountPrice,
        stockBySize,
        category,
        collection,
        removeImages, // Stringified JSON array of image URLs to remove
      } = req.body;

      // 🟡 Basic field updates
      if (title) product.title = title;
      if (description) product.description = description;
      if (price !== undefined) product.price = price;
      if (discountPrice !== undefined) product.discountPrice = discountPrice;
      if (category) product.category = category;
      if (collection) product.collection = collection;

      // ✅ Handle stockBySize update
      if (stockBySize) {
        try {
          product.stockBySize = JSON.parse(stockBySize);
        } catch (e) {
          return res.status(400).json({ message: "Invalid stockBySize format" });
        }
      }

      // 🗑️ Remove selected old images from Cloudinary + DB
      if (removeImages) {
        const parsedRemove = JSON.parse(removeImages); // e.g. ["https://..."]
        product.image = product.image.filter((imgUrl) => {
          if (parsedRemove.includes(imgUrl)) {
            const publicId = imgUrl.split("/").pop().split(".")[0];
            cloudinary.uploader.destroy(`products/${publicId}`);
            return false; // remove from DB
          }
          return true; // keep in DB
        });
      }

      // ➕ Add newly uploaded images
      if (req.files && req.files.length > 0) {
        const newImageUrls = req.files.map((file) => file.path);
        product.image.push(...newImageUrls);
      }

      const updatedProduct = await product.save();
      res.status(200).json({
        message: "✅ Product updated successfully",
        updatedProduct,
      });
    } catch (error) {
      console.error("🔴 Product update error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// delete the product from the database
// add admin after testing
router.delete("/del/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "No product found." });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Product delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/// get the data of the produvc
router.get("/detail/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error("message", error);
    res.status(500).json({ message: "Server error" });
  }
});

//get the latest products

router.get("/latest", async (req, res) => {
  try {
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(6); // get latest 10

    res.status(200).json({ latestProducts });
  } catch (error) {
    console.error("Error fetching latest products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//// get similar producta
router.get("/similar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    // Fetch the current product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Find similar products by category, excluding the current product
    const similarProducts = await Product.find({
      _id: { $ne: product._id },

      category: product.category,
    })
      .limit(4)
      .lean();

    res.status(200).json({ similarProducts });
  } catch (error) {
    console.error("Error fetching similar products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//get api product of all the data
router.get("/filter", async (req, res) => {
  try {
    const { category, collectionName, sortby, search, limit } = req.query;

    const query = {};

    // Filter by category
    if (category && category.toLowerCase() !== "all") {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    // Filter by collection
    if (collectionName && collectionName.toLowerCase() !== "all") {
      query.collection = collectionName; // fix: should match your schema key (likely "collection")
    }

    // Text search in title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting logic
    const sortOptions = {
      priceAsc: { discountPrice: 1 }, // Low to high
      priceDsc: { discountPrice: -1 }, // High to low
      newest: { createdAt: -1 }, // Recently added (newest first)
      oldest: { createdAt: 1 }, // Oldest first
    };
    const sort = sortOptions[sortby] || {};

    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    if (!products.length) {
      return res.status(404).json({ message: "No products found." });
    }

    res.json({ products });
  } catch (error) {
    console.error("🔴 Filter error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reduce stock quantity for a specific size in a product
router.put("/reduce-stock/:id", protect, async (req, res) => {
  const { size, quantity } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const sizeEntry = product.stockBySize.find((s) => s.size === size);
    if (!sizeEntry) return res.status(400).json({ message: "Size not found" });

    if (sizeEntry.quantity < quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    sizeEntry.quantity -= quantity;

    await product.save();
    res.json({ message: "Stock updated", stockBySize: product.stockBySize });
  } catch (err) {
    res.status(500).json({ message: "Failed to update stock" });
  }
});

module.exports = router; // ✅ export the router



