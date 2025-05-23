// import { useEffect, useState } from "react";
// import "./adminDashboard.css";

// export default function AdminDashboard() {
//   const [products, setProducts] = useState({
//     name: "",
//     price: "",
//     productCount: ""
//   });

//   const [productList, setProductList] = useState([]);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editId, setEditId] = useState(null);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await fetch("https://organic-e-commerce.onrender.com/check-products");
//       const data = await res.json();
//       setProductList(data.products);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProducts((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const url = isEditMode
//       ? `https://organic-e-commerce.onrender.com/update-product/${editId}`
//       : "https://organic-e-commerce.onrender.com/add-products";

//     const method = isEditMode ? "PUT" : "POST";
//     const token = localStorage.getItem("token");

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify(products)
//       });

//       const result = await res.json();

//       alert(isEditMode ? "Product updated successfully" : "Product added successfully");

//       setProducts({ name: "", price: "", productCount: "" });
//       setIsEditMode(false);
//       setEditId(null);
//       fetchProducts();
//     } catch (err) {
//       console.error("Error submitting product:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await fetch(`https://organic-e-commerce.onrender.com/delete-product/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Authorization": `Bearer ${localStorage.getItem("token")}`
//         }
//       });
//       alert("Product deleted successfully");
//       fetchProducts();
//     } catch (err) {
//       console.error("Error deleting product:", err);
//     }
//   };

//   const handleEdit = (product) => {
//     setIsEditMode(true);
//     setEditId(product._id);
//     setProducts({
//       name: product.name,
//       price: product.price,
//       productCount: product.productCount
//     });
//   };

//   return (
//     <div className="admin-form-container">
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="name">Product Name</label>
//         <input
//           type="text"
//           id="name"
//           name="name"
//           value={products.name}
//           onChange={handleChange}
//           required
//         />

//         <label htmlFor="price">Product Price</label>
//         <input
//           type="text"
//           id="price"
//           name="price"
//           value={products.price}
//           onChange={handleChange}
//           required
//         />

//         <label htmlFor="productCount">Product Count</label>
//         <input
//           type="number"
//           id="productCount"
//           name="productCount"
//           value={products.productCount}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="submit"
//           value={isEditMode ? "Update Product" : "Add Product"}
//         />
//       </form>

//       <h2>All Products</h2>
//       <table className="product-table">
//         <thead>
//           <tr>
//             <th>S.No.</th>
//             <th>Name</th>
//             <th>Price</th>
//             <th>Count</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {productList.length > 0 ? (
//             productList.map((product, index) => (
//               <tr key={product._id || index}>
//                 <td>{index + 1}</td>
//                 <td>{product.name}</td>
//                 <td>₹{product.price}</td>
//                 <td>{product.productCount}</td>
//                 <td>
//                   <button className="edit-btn" onClick={() => handleEdit(product)}>
//                     Edit
//                   </button>
//                   <button className="delete-btn" onClick={() => handleDelete(product._id)}>
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5">No products found.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
  

import { useEffect, useState } from "react";
import "./adminDashboard.css";

export default function AdminDashboard() {
  const [products, setProducts] = useState({
    name: "",
    price: "",
    productCount: ""
  });

  const [productList, setProductList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://organic-e-commerce.onrender.com/check-products");
      const data = await res.json();
      setProductList(data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducts((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditMode
      ? `https://organic-e-commerce.onrender.com/update-products/${editId}` // ✅ Fixed route
      : "https://organic-e-commerce.onrender.com/add-products";

    const method = isEditMode ? "PUT" : "POST";
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
         
        },
          credentials: "include",
        body: JSON.stringify(products)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      alert(isEditMode ? "Product updated successfully" : "Product added successfully");

      setProducts({ name: "", price: "", productCount: "" });
      setIsEditMode(false);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error("Error submitting product:", err);
      alert(err.message || "Submission failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://organic-e-commerce.onrender.com/delete-product/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Delete failed");
      }

      alert("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err.message || "Delete failed");
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

  return (
    <div className="admin-form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Product Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={products.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="price">Product Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={products.price}
          onChange={handleChange}
          required
        />

        <label htmlFor="productCount">Product Count</label>
        <input
          type="number"
          id="productCount"
          name="productCount"
          value={products.productCount}
          onChange={handleChange}
          required
        />

        <input
          type="submit"
          value={isEditMode ? "Update Product" : "Add Product"}
        />
      </form>

      <h2>All Products</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Name</th>
            <th>Price</th>
            <th>Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productList.length > 0 ? (
            productList.map((product, index) => (
              <tr key={product._id || index}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>₹{product.price}</td>
                <td>{product.productCount}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
