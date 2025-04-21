const mongoose = require("mongoose");
const Product = require("./Product");

// Replace this with your actual MongoDB Atlas URI
const uri = 'mongodb+srv://mongo:mongo@cluster0.qw8c9jj.mongodb.net/Product?retryWrites=true&w=majority&appName=Cluster0';

// Your JSON data (make sure it's a properly formatted array)
const data = require("./products.js"); // Assuming you saved the array to products.json

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");
    await Product.insertMany(data);
    console.log("Data inserted successfully");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("Error:", err);
  });
