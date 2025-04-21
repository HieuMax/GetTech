// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: String,
    image: String,
    name: String,
    price: Number,
    brand: String,
    description: String,
    rating: Number,
    sizeScreen: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
