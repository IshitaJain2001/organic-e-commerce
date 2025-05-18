// const express = require("express");
// const dotenv = require("dotenv").config();
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const axios = require("axios");
// const session = require("express-session");

// const app = express();


// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log("MongoDB error:", err));

//   app.use(cors());
// app.use(express.json());
// app.use(
//   session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Set to true only if using HTTPS
//   })
// );
// const productsSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   productCount: { type: Number, required: true },
// });
// const Product = mongoose.model("Product", productsSchema);

// // User Schema
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   isAdmin: { type: Boolean, default: false },
//   phoneNumber: String,
// });
// const User = mongoose.model("User", userSchema);

// const cartSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
//   items: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//       name: { type: String, required: true },
//       price: { type: Number, required: true },
//       quantity: { type: Number, required: true, default: 1 }
//     }
//   ]
// }, {
//   timestamps: true // For tracking cart creation and updates
// });

// const Cart = mongoose.model('Cart', cartSchema);

// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token provided" });
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.user = decoded;
//     next();
//   } catch (e) {
//     res.status(403).json({ message: "Invalid token" });
//   }
// };

// const isAdmin = (req, res, next) => {
//   if (!req.user?.isAdmin) return res.status(403).json({ message: "Admin access only" });
//   next();
// };

// app.get("/check-products", async (req, res) => {
//   const products = await Product.find();
//   const productCount = await Product.countDocuments();
//   res.json({ productCount, products });
// });

// app.post("/add-products", verifyToken, isAdmin, async (req, res) => {
//   const { name, price, productCount } = req.body;
//   if (!name || price == null || productCount == null) {
//     return res.status(400).send("Enter all required details");
//   }
//   try {
//     const product = new Product({ name, price, productCount });
//     await product.save();
//     res.json(product);
//   } catch (e) {
//     res.status(500).send(e.message);
//   }
// });

// app.delete("/delete-product/:id", verifyToken, isAdmin, async (req, res) => {
//   await Product.findByIdAndDelete(req.params.id);
//   res.send("Product deleted");
// });

// app.put("/update-product/:id", verifyToken, isAdmin, async (req, res) => {
//   const { id } = req.params;
//   const { name, price, productCount } = req.body;
//   try {
//     const updated = await Product.findByIdAndUpdate(id, { name, price, productCount }, { new: true });
//     if (!updated) return res.status(404).json({ message: "Product not found" });
//     res.json({ message: "Product updated", product: updated });
//   } catch (err) {
//     res.status(500).json({ error: "Update error" });
//   }
// });
// // Function to generate a 6-digit OTP
// function generateOtp() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }
// const sendSMS = async (phone, otp) => {
//   try {
//     const response = await axios.post(
//       "https://www.fast2sms.com/dev/bulkV2",
//       {
//         route: "otp",
//         sender_id: "FSTSMS",  // required by Fast2SMS
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
//     // This will show the exact API error message if available
//     console.error("Error sending SMS:", error.response?.data || error.message);
//     throw error;
//   }
// };

// app.post("/send-otp", async (req, res) => {
//   console.log("Request received at /send-otp"); // <--- yeh zaroori hai
//   const phoneNumber = req.body.phoneNumber;

//   if (!phoneNumber) {
//     console.log("Phone number not provided");
//     return res.status(400).json({ error: "Phone number is required" });
//   }

//   const otp = generateOtp(); // assume yeh function OTP bana raha hai
//   console.log("Generated OTP:", otp);

//   // OTP ko session mein save karo
//   req.session.otp = otp;
//   req.session.phone = phoneNumber;
//   console.log("Session after OTP save:", req.session);
//   await sendSMS(phoneNumber, otp);
//   // Send fake response (ya Twilio ka code ho)
//   res.json({ message: "OTP sent successfully", otp }); // development mein OTP dikhana okay hai
// });


// // Verify OTP and Register the user
// app.post("/verify-otp", async (req, res) => {
//   const { otp, name, email, password, phoneNumber } = req.body;

//   try {
//     // Compare the OTP
//     if (otp !== req.session.otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       phoneNumber,
//     });

//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({ message: "User registration failed" });
//   }
// });

// // app.post("/login", async (req, res) => {
// //   const { email, password } = req.body;
// //   try {
// //     if (email === process.env.SUPER_ADMIN_EMAIL && password === process.env.SUPER_ADMIN_PASSWORD) {
// //       const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
// //       return res.status(200).json({ message: "Superadmin logged in", token, isAdmin: true });
// //     }

// //     const user = await User.findOne({ email });
// //     if (!user) return res.status(400).json({ message: "Invalid email or password" });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

// //     const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
// //     res.status(200).json({ message: "Login successful", token, isAdmin: user.isAdmin });
// //   } catch (err) {
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });


// // app.post("/login", async (req, res) => {
// //   const { email, password } = req.body;

// //   // 👇 Hardcoded test credentials
// //   const testEmail = "test@example.com";
// //   const testPassword = "123456";

// //   try {
// //     // If hardcoded test credentials match
// //     if (email === testEmail && password === testPassword) {
// //       const token = jwt.sign(
// //         { id: "dummyUserId123", isAdmin: false }, // id can be any dummy value
// //         process.env.JWT_SECRET_KEY,
// //         { expiresIn: "1d" }
// //       );
// //       return res.status(200).json({
// //         message: "Hardcoded user logged in",
// //         token,
// //         isAdmin: false,
// //       });
// //     }

// //     // Superadmin login
// //     if (
// //       email === process.env.SUPER_ADMIN_EMAIL &&
// //       password === process.env.SUPER_ADMIN_PASSWORD
// //     ) {
// //       const token = jwt.sign(
// //         { email, isAdmin: true },
// //         process.env.JWT_SECRET_KEY,
// //         { expiresIn: "1d" }
// //       );
// //       return res.status(200).json({
// //         message: "Superadmin logged in",
// //         token,
// //         isAdmin: true,
// //       });
// //     }

// //     // Real user login (using DB)
// //     const user = await User.findOne({ email });
// //     if (!user)
// //       return res.status(400).json({ message: "Invalid email or password" });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch)
// //       return res.status(400).json({ message: "Invalid email or password" });

// //     const token = jwt.sign(
// //       { id: user._id, isAdmin: user.isAdmin },
// //       process.env.JWT_SECRET_KEY,
// //       { expiresIn: "1d" }
// //     );
// //     res.status(200).json({
// //       message: "Login successful",
// //       token,
// //       isAdmin: user.isAdmin,
// //     });
// //   } catch (err) {
// //     console.error("Login error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // app.post("/login", async (req, res) => {
// //   const { email, password } = req.body;

// //   // 👇 Hardcoded test credentials
// //   const testEmail = "test@example.com";
// //   const testPassword = "123456";

// //   try {
// //     // If hardcoded test credentials match
// //     if (email === testEmail && password === testPassword) {
// //       const token = jwt.sign(
// //         { id: "dummyUserId123", isAdmin: false }, // id can be any dummy value
// //         process.env.JWT_SECRET_KEY,
// //         { expiresIn: "1d" }
// //       );
// //       return res.status(200).json({
// //         message: "Hardcoded user logged in",
// //         token,
// //         isAdmin: false,
// //       });
// //     }

// //     // Superadmin login
// //     if (
// //       email === process.env.SUPER_ADMIN_EMAIL &&
// //       password === process.env.SUPER_ADMIN_PASSWORD
// //     ) {
// //       const token = jwt.sign(
// //         { email, isAdmin: true },
// //         process.env.JWT_SECRET_KEY,
// //         { expiresIn: "1d" }
// //       );
// //       return res.status(200).json({
// //         message: "Superadmin logged in",
// //         token,
// //         isAdmin: true,
// //       });
// //     }

// //     // Real user login (using DB)
// //     const user = await User.findOne({ email });
// //     if (!user)
// //       return res.status(400).json({ message: "Invalid email or password" });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch)
// //       return res.status(400).json({ message: "Invalid email or password" });

// //     const token = jwt.sign(
// //       { id: user._id, isAdmin: user.isAdmin },
// //       process.env.JWT_SECRET_KEY,
// //       { expiresIn: "1d" }
// //     );
// //     res.status(200).json({
// //       message: "Login successful",
// //       token,
// //       isAdmin: user.isAdmin,
// //     });
// //   } catch (err) {
// //     console.error("Login error:", err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });


// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   // Hardcoded test credentials
//   const testEmail = "test@example.com";
//   const testPassword = "123456";

//   try {
//     // Hardcoded test user
//     if (email === testEmail && password === testPassword) {
//       const token = jwt.sign(
//         { id: "dummyUserId123", isAdmin: false },
//         process.env.JWT_SECRET_KEY,
//         { expiresIn: "1d" }
//       );
//       return res.status(200).json({
//         message: "Hardcoded user logged in",
//         token,
//         isAdmin: false,
//       });
//     }

//     // Superadmin login
//     if (
//       email === process.env.SUPER_ADMIN_EMAIL &&
//       password === process.env.SUPER_ADMIN_PASSWORD
//     ) {
//       const token = jwt.sign(
//         { email, isAdmin: true },
//         process.env.JWT_SECRET_KEY,
//         { expiresIn: "1d" }
//       );
//       return res.status(200).json({
//         message: "Superadmin logged in",
//         token,
//         isAdmin: true,
//       });
//     }

//     // Real DB user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const token = jwt.sign(
//       { id: user._id, isAdmin: user.isAdmin },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       isAdmin: user.isAdmin,
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.post('/update-stock', async (req, res) => {
//   const { productId, quantity } = req.body;

//   try {
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     if (product.productCount < quantity) {
//       return res.status(400).json({ message: "Not enough stock" });
//     }

//     product.productCount -= quantity;
//     await product.save();

//     res.status(200).json({ message: "Stock updated successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Add product to cart
// app.post("/cart", async (req, res) => {
//   const { productId, quantity } = req.body;

//   try {
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     let cart = await Cart.findOne({ user: req.user.id });

//     if (!cart) {
//       // Create a new cart if not exist
//       cart = new Cart({ user: req.user.id, items: [{ productId, quantity }] });
//     } else {
//       // Update cart if the product already exists in the cart
//       const productInCart = cart.items.find(item => item.productId.toString() === productId);
//       if (productInCart) {
//         productInCart.quantity += quantity;
//       } else {
//         cart.items.push({ productId, quantity });
//       }
//     }

//     await cart.save();
//     res.status(200).json({ message: "Product added to cart", cart });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });


// app.get("/cart", async (req, res) => {
//   try {
//     // Cart ko fetch karo, bina user authentication ke
//     const cart = await Cart.findOne({});  // agar user nahi chahiye to simply Cart.findOne({}) use karenge
    
//     if (!cart) {
//       return res.status(404).json({ message: "Cart is empty" });
//     }

//     res.status(200).json(cart.items);  // Cart items ko return karo
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.delete("/remove-from-cart/:productId",  async (req, res) => {
//   const { productId } = req.params;
//   try {
//     const cart = await Cart.findOne({ user: req.user.id });

//     if (!cart || cart.items.length === 0) {
//       return res.status(404).json({ message: "Cart is empty" });
//     }

//     // Remove item from the cart
//     cart.items = cart.items.filter(item => item.productId.toString() !== productId);
//     await cart.save();

//     res.status(200).json({ message: "Item removed from cart", cart });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error removing item from cart" });
//   }
// });


// app.put("/update-cart/:productId", async (req, res) => {
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

//     // Update the quantity
//     cart.items[itemIndex].quantity = quantity;
//     await cart.save();

//     res.status(200).json({ message: "Cart updated successfully", cart });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error updating cart" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });



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

// OTP Utility
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendSMS = async (phone, otp) => {
  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",
        sender_id: "FSTSMS",
        variables_values: otp,
        flash: 0,
        numbers: phone,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("SMS sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending SMS:", error.response?.data || error.message);
    throw error;
  }
};

// Send OTP Route
app.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const otp = generateOtp();
  req.session.otp = otp;
  req.session.phone = phoneNumber;

  try {
    await sendSMS(phoneNumber, otp);
    res.json({ message: "OTP sent successfully", otp }); // Show OTP only during development
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP and Register
app.post("/verify-otp", async (req, res) => {
  const { otp, name, email, password, phoneNumber } = req.body;

  try {
    if (otp !== req.session.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, phoneNumber });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "User registration failed" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
console.log("Login request:", req.body);
  const testEmail = "test@example.com";
  const testPassword = "123456";

  try {
    if (email === testEmail && password === testPassword) {
      const token = jwt.sign(
        { id: "testUser", isAdmin: false },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      return res.json({ message: "Test user login", token, isAdmin: false });
    }

    if (email === process.env.SUPER_ADMIN_EMAIL && password === process.env.SUPER_ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email, isAdmin: true },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );
      return res.json({ message: "Superadmin login", token, isAdmin: true });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.json({ message: "Login successful", token, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
