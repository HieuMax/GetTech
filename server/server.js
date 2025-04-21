require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const { authenticate } = require('./middleware/auth');
const connectMongoDB = require('./db');
const product = require('./models/product');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas using the existing connection function
connectMongoDB();

// Routes
app.use('/api/auth', authRoutes);

// Protected route example
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ 
    message: 'This is a protected route', 
    user: req.user 
  });
});

// GET all products - Protected
app.get('/api/objects', authenticate, async (req, res) => {
    try {
        const products = await product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
});

// Root route - Protected
app.get('/', authenticate, async (req, res) => {
    try {
        const products = await product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
});

const phoneSchema = new mongoose.Schema(
  {
    ID: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

const Phone = mongoose.model("Phone", phoneSchema);

// Hàm API: GET tất cả sản phẩm
app.get("/api/phones", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;

    if (limit === 0) {
      const phones = await product.find().sort({ createdAt: -1 });
      return res.json({
        total: phones.length,
        page: 1,
        limit: phones.length,
        phones,
      });
    }

    const skip = (page - 1) * limit;

    const phones = await product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPhones = await product.countDocuments();

    res.json({
      total: totalPhones,
      page,
      limit,
      phones,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách sản phẩm" });
  }
});

// Hàm API: POST sản phẩm mới
app.post("/api/createPhone", async (req, res) => {
  try {
    const { ID, image, name, price, brand, description, rating } = req.body;

    if (!ID || !image || !name || !price || !brand) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ các trường bắt buộc!" });
    }

    const existingPhone = await product.findOne({ ID });
    if (existingPhone) {
      return res.status(409).json({ message: "ID sản phẩm đã tồn tại!" });
    }

    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Đánh giá phải trong khoảng từ 0 đến 5." });
    }

    const newPhone = new Phone({
      ID,
      image,
      name,
      price,
      brand,
      description,
      rating,
    });

    await newproduct.save();

    return res
      .status(201)
      .json({ message: "Tạo sản phẩm thành công!", phone: newPhone });
  } catch (error) {
    console.error("Lỗi tạo sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ!" });
  }
});

// Hàm API: GET ID sản phẩm tiếp theo theo phân loại
app.get("/api/phones/next-id/:category", async (req, res) => {
  const { category } = req.params;

  if (!["MOBL", "LAPT", "HEAD", "TABL", "ACCE"].includes(category)) {
    return res.status(400).json({ message: "Phân loại không hợp lệ." });
  }

  try {
    const latestProduct = await product.findOne({
      ID: { $regex: `^PROD${category}` },
    })
      .sort({ createdAt: -1 })
      .exec();

    let nextNumber = "0001";

    if (latestProduct) {
      const lastID = latestProduct.id;
      const lastNumber = parseInt(lastID.slice(-4));
      nextNumber = (lastNumber + 1).toString().padStart(4, "0");
    }
    console.log(latestProduct);

    const nextID = `PROD${category}${nextNumber}`;
    res.json({ nextID });
  } catch (err) {
    console.error("Lỗi tạo ID:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi tạo ID" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
