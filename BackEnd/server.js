const express = require("express");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const axios = require("axios");


const app = express();


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

  app.use(cors());
app.use(express.json());

const productsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productCount: { type: Number, required: true },
});
const Product = mongoose.model("Product", productsSchema);

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  phoneNumber: String,
});
const User = mongoose.model("User", userSchema);


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(403).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ message: "Admin access only" });
  next();
};

app.get("/check-products", async (req, res) => {
  const products = await Product.find();
  const productCount = await Product.countDocuments();
  res.json({ productCount, products });
});

app.post("/add-products", verifyToken, isAdmin, async (req, res) => {
  const { name, price, productCount } = req.body;
  if (!name || price == null || productCount == null) {
    return res.status(400).send("Enter all required details");
  }
  try {
    const product = new Product({ name, price, productCount });
    await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.delete("/delete-product/:id", verifyToken, isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.send("Product deleted");
});

app.put("/update-product/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, price, productCount } = req.body;
  try {
    const updated = await Product.findByIdAndUpdate(id, { name, price, productCount }, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ error: "Update error" });
  }
});

app.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP

    // Send OTP via Fast2SMS (you can replace with any SMS API)
    const response = await axios.post("https://www.fast2sms.com/dev/bulk", null, {
      params: {
        sender_id: "FSTSMS",
        message: `Your OTP is ${otp}`,
        language: "english",
        route: "p",
        numbers: phoneNumber,
      },
      headers: {
        authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
      },
    });

    // In a real-world app, store OTP in a secure location (e.g., Redis) for validation
    // For simplicity, we will store OTP temporarily in-memory (this should be improved)
    req.session.otp = otp;
console.log(response.data);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP and Register the user
app.post("/verify-otp", async (req, res) => {
  const { otp, name, email, password, phoneNumber } = req.body;

  try {
    // Compare the OTP
    if (otp !== req.session.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "User registration failed" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === process.env.SUPER_ADMIN_EMAIL && password === process.env.SUPER_ADMIN_PASSWORD) {
      const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
      return res.status(200).json({ message: "Superadmin logged in", token, isAdmin: true });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
    res.status(200).json({ message: "Login successful", token, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
