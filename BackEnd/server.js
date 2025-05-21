

// const express = require("express");
// const dotenv = require("dotenv").config();
// const cors = require("cors");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const session = require("express-session");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors({
//   origin: "https://organic-e-commerce-1.onrender.com",
//   credentials: true
// }));
// app.use(express.json());
// app.use(session({
//   secret: "your_secret_key",
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false,       // Set true in production (with HTTPS)
//     httpOnly: true,
//     sameSite: 'lax'
//   }
// }));

// // MongoDB Connection
// mongoose.set("strictQuery", true);
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log("MongoDB error:", err));

// // Schemas
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   isAdmin: { type: Boolean, default: false },
//   phoneNumber: String,
// });
// const User = mongoose.model("User", userSchema);

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   productCount: { type: Number, required: true },
// });
// const Product = mongoose.model("Product", productSchema);

// const cartSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
//   items: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//       name: String,
//       price: Number,
//       quantity: { type: Number, default: 1 },
//     },
//   ],
// }, { timestamps: true });
// const Cart = mongoose.model("Cart", cartSchema);

// // Middleware: Check if user is logged in
// const verifySession = (req, res, next) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   req.user = req.session.user;
//   next();
// };

// // Middleware: Check Admin
// const isAdmin = (req, res, next) => {
//   if (!req.user?.isAdmin) return res.status(403).json({ message: "Admin access only" });
//   next();
// };

// // Auth Routes
// app.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword });
//     await user.save();
//     res.status(201).json({ message: "Registration successful" });
//   } catch (err) {
//     res.status(500).json({ message: "Registration failed", error: err.message });
//   }
// });

// const verifyToken = (req, res, next) => {
//   const token = req.headers["authorization"];
//   if (!token) return res.status(403).json({ message: "Token required" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check against .env admin credentials
//     if (
//       email === process.env.SUPER_ADMIN_EMAILL &&
//       password === process.env.SUPER_ADMIN_PASSWORD
//     ) {
//       req.session.user = {
//         id: "admin-env", // dummy id
//         isAdmin: true
//       };

//       return res.json({
//         message: "Admin login successful",
//         user: {
//           id: "admin-env",
//           isAdmin: true
//         },
//         redirectTo: "/admin"
//       });
//     }

//     // Normal DB-based login
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     req.session.user = {
//       id: user._id,
//       isAdmin: user.isAdmin
//     };

//     const redirectTo = user.isAdmin ? "/admin" : "/dashboard";

//     res.json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         isAdmin: user.isAdmin
//       },
//       redirectTo
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Login failed", error: err.message });
//   }
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

// app.post("/logout", (req, res) => {
//   req.session.destroy(() => {
//     res.clearCookie("connect.sid");
//     res.json({ message: "Logged out" });
//   });
// });

// // Product Routes
// app.get("/products", async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json({ products });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching products" });
//   }
// });

// app.post("/products", verifySession, isAdmin, async (req, res) => {
//   const { name, price, productCount } = req.body;
//   if (!name || price == null || productCount == null) {
//     return res.status(400).json({ message: "Missing fields" });
//   }

//   try {
//     const product = new Product({ name, price, productCount });
//     await product.save();
//     res.json({ message: "Product added", product });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to add product", error: err.message });
//   }
// });

// // Cart Routes
// app.post("/cart", verifySession, async (req, res) => {
//   const { productId, quantity } = req.body;
//   try {
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     let cart = await Cart.findOne({ user: req.user.id });
//     if (!cart) {
//       cart = new Cart({
//         user: req.user.id,
//         items: [{ productId, name: product.name, price: product.price, quantity }],
//       });
//     } else {
//       const index = cart.items.findIndex(item => item.productId.toString() === productId);
//       if (index !== -1) {
//         cart.items[index].quantity += quantity;
//       } else {
//         cart.items.push({ productId, name: product.name, price: product.price, quantity });
//       }
//     }
//     await cart.save();
//     res.json({ message: "Cart updated", cart });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating cart", error: err.message });
//   }
// });

// app.get("/cart", verifySession, async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user.id });
//     if (!cart) return res.status(404).json({ message: "Cart is empty" });
//     res.json({ cart });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching cart" });
//   }
// });

// app.delete("/cart/remove/:productId", verifySession, async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user.id });
//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
//     await cart.save();
//     res.json({ message: "Item removed", cart });
//   } catch (err) {
//     res.status(500).json({ message: "Error removing item", error: err.message });
//   }
// });

// app.put("/cart/update/:productId", verifySession, async (req, res) => {
//   const { quantity } = req.body;
//   try {
//     const cart = await Cart.findOne({ user: req.user.id });
//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     const index = cart.items.findIndex(item => item.productId.toString() === req.params.productId);
//     if (index === -1) return res.status(404).json({ message: "Item not in cart" });

//     cart.items[index].quantity = quantity;
//     await cart.save();
//     res.json({ message: "Quantity updated", cart });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating quantity", error: err.message });
//   }
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://organic-e-commerce-1.onrender.com",
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set true in production with HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// MongoDB Connection
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  phoneNumber: String,
});
const User = mongoose.model("User", userSchema);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productCount: { type: Number, required: true },
});
const Product = mongoose.model("Product", productSchema);

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

// Middleware: Session check
const verifySession = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = req.session.user;
  next();
};

// Middleware: Admin check
const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ message: "Admin access only" });
  next();
};

// Auth Routes
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (
      email === process.env.SUPER_ADMIN_EMAIL &&
      password === process.env.SUPER_ADMIN_PASSWORD
    ) {
      req.session.user = {
        id: "admin-env",
        isAdmin: true
      };

      return res.json({
        message: "Admin login successful",
        user: {
          id: "admin-env",
          isAdmin: true
        },
        redirectTo: "/admin"
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    req.session.user = {
      id: user._id,
      isAdmin: user.isAdmin
    };

    const redirectTo = user.isAdmin ? "/admin" : "/dashboard";

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        isAdmin: user.isAdmin
      },
      redirectTo
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

// Product Routes
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

app.post("/products", verifySession, isAdmin, async (req, res) => {
  const { name, price, productCount } = req.body;
  if (!name || price == null || productCount == null) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const product = new Product({ name, price, productCount });
    await product.save();
    res.json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ message: "Failed to add product", error: err.message });
  }
});

app.put("/update-product/:id", verifySession, isAdmin, async (req, res) => {
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

app.post("/add-products", verifySession, isAdmin, async (req, res) => {
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

app.delete("/delete-product/:id", verifySession, isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.send("Product deleted");
});

// Cart Routes
app.post("/cart", verifySession, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [{ productId, name: product.name, price: product.price, quantity }],
      });
    } else {
      const index = cart.items.findIndex(item => item.productId.toString() === productId);
      if (index !== -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, name: product.name, price: product.price, quantity });
      }
    }
    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ message: "Error updating cart", error: err.message });
  }
});

app.get("/cart", verifySession, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart is empty" });
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

app.delete("/cart/remove/:productId", verifySession, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ message: "Error removing item", error: err.message });
  }
});

app.put("/cart/update/:productId", verifySession, async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(item => item.productId.toString() === req.params.productId);
    if (index === -1) return res.status(404).json({ message: "Item not in cart" });

    cart.items[index].quantity = quantity;
    await cart.save();
    res.json({ message: "Quantity updated", cart });
  } catch (err) {
    res.status(500).json({ message: "Error updating quantity", error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
