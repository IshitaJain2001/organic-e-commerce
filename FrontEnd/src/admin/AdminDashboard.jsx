import { useEffect, useState } from "react";
import "./adminDashboard.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../cartActions"; // Adjust this path

export default function AdminDashboard() {
  const [products, setProducts] = useState({
    name: "",
    price: "",
    productCount: ""
  });

  const [productList, setProductList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://organic-e-commerce.onrender.com/products", {
        credentials: "include"
      });
      const data = await res.json();
      setProductList(data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleChange = (e) => {
    setProducts({ ...products, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    const url = isEditMode
      ? `https://organic-e-commerce.onrender.com/update-product/${editId}`
      : "https://organic-e-commerce.onrender.com/add-products";

    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(products)
      });

      const data = await res.json();
      if (res.ok) {
        fetchProducts();
        setProducts({ name: "", price: "", productCount: "" });
        setIsEditMode(false);
        setEditId(null);
        alert(data.message);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleEdit = (product) => {
    setIsEditMode(true);
    setEditId(product._id);
    setProducts({
      name: product.name,
      price: product.price,
      productCount: product.productCount
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://organic-e-commerce.onrender.com/delete-product/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await res.text();
      alert(data);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="admin-form-container">
      <h2>Admin Dashboard</h2>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={products.name}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={products.price}
        onChange={handleChange}
      />
      <input
        type="number"
        name="productCount"
        placeholder="Product Count"
        value={products.productCount}
        onChange={handleChange}
      />
      <button onClick={handleAddOrUpdate}>
        {isEditMode ? "Update Product" : "Add Product"}
      </button>

      <h3>Product List</h3>
      <ul>
        {productList.map((product) => (
          <li key={product._id}>
            {product.name} - ₹{product.price} - {product.productCount} pcs
            <button onClick={() => handleEdit(product)}>✏️</button>
            <button onClick={() => handleDelete(product._id)}>🗑️</button>
            <button onClick={() => handleAddToCart(product)}>🛒 Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
