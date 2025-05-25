// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../cartActions";
// import "./Products.css";

// export default function Products() {
//   const [products, setProducts] = useState({ products: [] });
//   const dispatch = useDispatch();

//   useEffect(() => {
//     async function getData() {
//       try {
//         let data = await fetch("https://organic-e-commerce.onrender.com/check-products");
//         let res = await data.json();
//         setProducts(res);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//       }
//     }

//     getData();
//   }, []);

//   const handleAddToCart = async (productIndex) => {
//     const updatedProducts = [...products.products];
//     const selectedProduct = updatedProducts[productIndex];

//     if (selectedProduct.productCount > 0) {
//       selectedProduct.productCount -= 1;
//       setProducts({ products: updatedProducts });

//       dispatch(addToCart(selectedProduct));

//       alert("Product added to cart!");

//       await fetch("https://organic-e-commerce.onrender.com/update-stock", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ productId: selectedProduct._id, quantity: 1 }),
//       });
//     } else {
//       alert("Out of stock!");
//     }
//   };

//   let productList = products.products || [];

//   return (
//     <section className="products-section">
//       <h2 className="section-title">Featured Products</h2>
//       <div className="product-list">
//         {productList.length > 0 ? (
//           productList.map((product, index) => (
//             <div key={index} className="product-card">
//               <h3>{product.name}</h3>
//               <p className="price">₹{product.price}</p>
//               <p className="stock">In Stock: {product.productCount}</p>
//               <button onClick={() => handleAddToCart(index)} className="add-to-cart-btn">
//                 Add to Cart
//               </button>
//             </div>
//           ))
//         ) : (
//           <p className="empty-message">No products available</p>
//         )}
//       </div>
//     </section>
//   );
// }



import React from "react";
import "./ProfileCard.css";

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-container">
      <h2 className="profile-heading">Welcome, {user.name || "User"} 👋</h2>

      <div className="profile-info">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
        <p><strong>Address:</strong> {user.address || "Not provided"}</p>
      </div>

      <div className="section">
        <h3>🛒 Cart Details</h3>
   
        <p>You have {user.cart?.length || 0} items in your cart.</p>
      </div>

      <div className="section">
        <h3>📦 Order History</h3>

        <p>{user.orders?.length || 0} orders placed.</p>
      </div>
    </div>
  );
};

export default ProfileCard;
