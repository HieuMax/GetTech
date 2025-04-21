require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const { authenticate } = require("./middleware/auth");
const connectMongoDB = require("./db");
const product = require("./models/product");
const cloudinary = require("./lib/cloudinary");
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" })); // parse JSON request bodies

// Connect to MongoDB Atlas using the existing connection function
connectMongoDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// Protected route example
app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user,
  });
});

// GET all products - Protected
app.get("/api/objects", authenticate, async (req, res) => {
  try {
    const products = await product.find();
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
  }
});

// Root route - Protected
app.get("/", authenticate, async (req, res) => {
  try {
    const products = await product.find();
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
  }
});

/*
@******************************************************************************************************************************************************
@ GET
@******************************************************************************************************************************************************
*/
app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const _p = await product.findOne({ id: id });
      if (!_p) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
      }

      // Get suggest product
      const name = _p.name;
      const brand = _p.brand;

      const namePrefix = name ? name.split(" ")[0] : "";
      const query = {
        $or: [],
      };
      if (namePrefix) {
        query.$or.push({ name: { $regex: "^" + namePrefix, $options: "i" } });
      }

      if (brand) {
        query.$or.push({ brand: brand });
      }
  
      const products = await product.find(query);
      res.json({ dataProduct: _p, dataSuggest: products });
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm" });
    }
  }
)

/*
@******************************************************************************************************************************************************
@ GET
@******************************************************************************************************************************************************
*/

// Hàm API: GET tất cả sản phẩm (HB)
app.get("/api/home/phones", async (req, res) => {
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

    const phones = await product
      .find()
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

// Hàm API: GET tất cả sản phẩm
app.get("/api/phones", async (req, res) => {
  try {
    const phones = await product.find().sort({ createdAt: -1 }); // sắp xếp theo mới nhất
    res.json(phones);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách sản phẩm" });
  }
});

// Hàm API: POST sản phẩm mới
app.post("/api/createPhone", async (req, res) => {
  try {
    const { id, image, name, price, brand, description, rating, sizeScreen } =
      req.body;
    if (!id || !image || !name || !price || !brand || !sizeScreen) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ các trường bắt buộc!" });
    }

    const existingPhone = await product.findOne({ id: id });
    if (existingPhone) {
      return res.status(409).json({ message: "ID sản phẩm đã tồn tại!" });
    }

    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Đánh giá phải trong khoảng từ 0 đến 5." });
    }
    let newPhone;
    if (image) {
      const imgResult = await cloudinary.uploader.upload(image);
      newPhone = new product({
        id: id,
        image: imgResult.secure_url,
        name,
        price,
        brand,
        description,
        rating,
        sizeScreen,
      });
    } else {
      newPhone = new product({
        id: id,
        name,
        price,
        brand,
        description,
        rating,
        sizeScreen,
      });
    }

    await newPhone.save();

    return res
      .status(201)
      .json({ message: "Tạo sản phẩm thành công!", phone: newPhone });
  } catch (error) {
    console.error("Lỗi tạo sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ!" });
  }
});

app.get("/api/phones/next-id/:category", async (req, res) => {
  const { category } = req.params;

  // Kiểm tra category hợp lệ
  if (!["MOBL", "LAPT", "HEAD", "TABL", "ACCE"].includes(category)) {
    return res.status(400).json({ message: "Phân loại không hợp lệ." });
  }

  try {
    // Tìm sản phẩm có ID thuộc category và có 4 số cuối lớn nhất
    const latestPhone = await product
      .findOne({
        id: { $regex: `^PROD${category}\\d{4}$` }, // Lọc ID bắt đầu bằng PROD + category + 4 số
      })
      .sort({ id: -1 }) // Sắp xếp giảm dần theo ID để lấy ID có 4 số cuối lớn nhất
      .exec();

    let nextNumber = "0001"; // Mặc định nếu không có sản phẩm
    if (latestPhone) {
      const lastID = latestPhone.id;
      const lastNumber = parseInt(lastID.slice(-4)); // Lấy 4 số cuối
      nextNumber = (lastNumber + 1).toString().padStart(4, "0"); // Tăng 1 và định dạng 4 chữ số
    }

    const nextID = `PROD${category}${nextNumber}`; // Tạo ID mới

    res.json({ nextID, latestPhone });
  } catch (err) {
    console.error("Lỗi tạo ID:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi tạo ID" });
  }
});

/*
@******************************************************************************************************************************************************
@ DELETE
@******************************************************************************************************************************************************
*/

// Hàm API: DELETE sản phẩm theo ID
app.delete("/api/deletePhone/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const phone = await product.findOne({ id: id });

    if (!phone) {
      return res.status(404).json({ message: "Phone not found" });
    }

    if (phone.image) {
      await cloudinary.uploader.destroy(
        phone.image.split("/").pop().split(".")[0]
      );
    }
    await product.findOneAndDelete({ id: id });

    res.status(200).json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ khi xóa sản phẩm" });
  }
});
app.get("/api/phone/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const phone = await product.findOne({ id: id });

    if (!phone) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
    }

    return res.json(phone);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm" });
  }
});
app.put("/api/updatePhone/:id", async (req, res) => {
  const { id } = req.params;
  const { image, name, price, brand, description, rating, sizeScreen } =
    req.body;

  try {
    // Kiểm tra các trường bắt buộc
    if (!image || !name || !price || !brand || !sizeScreen) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ các trường bắt buộc!" });
    }

    // Kiểm tra rating
    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Đánh giá phải trong khoảng từ 0 đến 5." });
    }

    // Tìm phone trong database
    const phone = await product.findOne({ id: id });

    if (!phone) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm để cập nhật!" });
    }

    let imageUrl = phone.image; // Giữ URL ảnh cũ làm mặc định

    // Nếu có ảnh mới được gửi lên
    if (image && image !== phone.image) {
      // Xóa ảnh cũ trên Cloudinary nếu tồn tại
      if (phone.image) {
        const publicId = phone.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload ảnh mới lên Cloudinary
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "phones", // Tùy chọn: thư mục lưu trên Cloudinary
      });

      imageUrl = uploadResult.secure_url; // Lấy URL của ảnh mới
    }

    // Cập nhật thông tin phone trong database
    const updatedPhone = await product.findOneAndUpdate(
      { id: id },
      { image: imageUrl, name, price, brand, description, rating, sizeScreen },
      { new: true }
    );

    if (!updatedPhone) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm để cập nhật!" });
    }

    return res.json({
      message: "Cập nhật sản phẩm thành công!",
      phone: updatedPhone,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ khi cập nhật sản phẩm" });
  }
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

/*
@******************************************************************************************************************************************************
@ START SERVER
@******************************************************************************************************************************************************
*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
