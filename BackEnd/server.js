

const express = require("express");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const axios = require("axios");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// DB Connection
mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// Schemas & Models
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  phoneNumber: String,
});
const User = mongoose.model("User", userSchema);

const productsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productCount: { type: Number, required: true },
});
const Product = mongoose.model("Product", productsSchema);

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
    },
  ],
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // For test user login
    if (email === "test@example.com" && password === "123456") {
      console.log("Email:", email, "Password:", password);

      const token = jwt.sign(
        { id: "testUser", isAdmin: false },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      return res.json({ message: "Test user login", token, isAdmin: false });
    }

    // For super admin login (credentials from env variables)
    if (
      email === process.env.SUPER_ADMIN_EMAIL &&
      password === process.env.SUPER_ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email, isAdmin: true },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      return res.json({ message: "Superadmin login", token, isAdmin: true });
    }

    // Find user from DB
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, isAdmin: user.isAdmin });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Middleware: Verify Token
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

// Middleware: Check Admin
const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ message: "Admin access only" });
  next();
};

// Product Routes
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
  const { name, price, productCount } = req.body;

  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, productCount },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ error: "Update error" });
  }
});
// Register User with Email and Password
app.post('/register', async (req, res) => {
  console.log(req.body);
  
  const { name, email, password} = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("user ecists");
      
      return res.status(400).json({ message: "User already exists" });}

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
console.log("User registered successfully:", email);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "User registration failed" });
  }
});

// OTP Utility
// function generateOtp() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// const sendSMS = async (phone, otp) => {
//   try {
//     const response = await axios.post(
//       "https://www.fast2sms.com/dev/bulkV2",
//       {
//         route: "otp",
//         sender_id: "FSTSMS",
//         variables_values: otp,
//         flash: 0,
//         numbers: phone,
//       },
//       {
//         headers: {
//           authorization: process.env.FAST2SMS_API_KEY,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("SMS sent successfully:", response.data);
//   } catch (error) {
//     console.error("Error sending SMS:", error.response?.data || error.message);
//     throw error;
//   }
// };

// Send OTP Route
// app.post("/send-otp", async (req, res) => {
//   const { phoneNumber } = req.body;

//   if (!phoneNumber) {
//     return res.status(400).json({ error: "Phone number is required" });
//   }

//   const otp = generateOtp();
//   req.session.otp = otp;
//   req.session.phone = phoneNumber;

//   try {
//     await sendSMS(phoneNumber, otp);
//     res.json({ message: "OTP sent successfully", otp }); // Show OTP only during development
//   } catch (err) {
//     res.status(500).json({ message: "Failed to send OTP" });
//   }
// });

// // Verify OTP and Register
// app.post("/verify-otp", async (req, res) => {
//   const { otp, name, email, password, phoneNumber } = req.body;

//   try {
//     if (otp !== req.session.otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({ name, email, password: hashedPassword, phoneNumber });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "User registration failed" });
//   }
// });

// Add product to cart (must be logged in)
// app.post("/cart", verifyToken, async (req, res) => {
//   const { productId, quantity } = req.body;

//   try {
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     let cart = await Cart.findOne({ user: req.user.id });

//     if (!cart) {
//       cart = new Cart({ user: req.user.id, items: [{ productId, name: product.name, price: product.price, quantity }] });
//     } else {
//       const productInCart = cart.items.find(item => item.productId.toString() === productId);
//       if (productInCart) {
//         productInCart.quantity += quantity;
//       } else {
//         cart.items.push({ productId, name: product.name, price: product.price, quantity });
//       }
//     }

//     await cart.save();
//     res.status(200).json({ message: "Product added to cart", cart });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get user's cart (must be logged in)
// app.get("/cart", verifyToken, async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user.id });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart is empty" });
//     }

//     res.status(200).json(cart.items);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Remove item from cart (must be logged in)
// app.delete("/remove-from-cart/:productId", verifyToken, async (req, res) => {
//   const { productId } = req.params;
//   try {
//     const cart = await Cart.findOne({ user: req.user.id });
//     if (!cart || cart.items.length === 0) {
//       return res.status(404).json({ message: "Cart is empty" });
//     }

//     cart.items = cart.items.filter(item => item.productId.toString() !== productId);
//     await cart.save();

//     res.status(200).json({ message: "Item removed from cart", cart });
//   } catch (err) {
//     res.status(500).json({ message: "Error removing item from cart" });
//   }
// });

// // Update item quantity (must be logged in)
// app.put("/update-cart/:productId", verifyToken, async (req, res) => {
//   const { productId } = req.params;
//   const { quantity } = req.body;

//   try {
//     const cart = await Cart.findOne({ user: req.user.id });
//     if (!cart || cart.items.length === 0) {
//       return res.status(404).json({ message: "Cart is empty" });
//     }

//     const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
//     if (itemIndex < 0) {
//       return res.status(404).json({ message: "Item not found in cart" });
//     }

//     cart.items[itemIndex].quantity = quantity;
//     await cart.save();

//     res.status(200).json({ message: "Cart updated successfully", cart });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating cart" });
//   }
// });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email and password match the super admin credentials in the .env file
    if (email === process.env.SUPER_ADMIN_EMAIL && password === process.env.SUPER_ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email, isAdmin: true },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      return res.json({
        message: "Super Admin login successful",
        token,
        isAdmin: true,
      });
    }

    // If not super admin, check user credentials from the database
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Return the response with the token and admin status (false if not admin)
    res.json({
      message: "Login successful",
      token,
      isAdmin: user.isAdmin,  // Send isAdmin status (false for non-admin users)
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
