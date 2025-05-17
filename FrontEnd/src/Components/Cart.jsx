// import React from "react";
// import { useSelector } from "react-redux";
// // import "./Cart.css"; // optional CSS file

// export default function Cart() {
//   // Getting cart from redux state
//   const cartItems = useSelector((state) => state.cart.items || []);
// console.log(cartItems);
//   return (
//     <section className="cart-section">
//       <h2 className="section-title">Your Cart</h2>

//       {cartItems.length === 0 ? (
//         <p className="empty-message">Your cart is empty.</p>
//       ) : (
//         <div className="cart-list">
//           {cartItems.map((item, index) => (
//             <div key={index} className="cart-item">
//               <h3>{item.name}</h3>
//               <p>Price: ₹{item.price}</p>
//               <p>Quantity: {item.quantity || 1}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }


import React from "react";
import { useSelector } from "react-redux";

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.items || []);
  console.log(cartItems); // Check in console

  return (
    <section className="cart-section">
      <h2 className="section-title">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-message">Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <p>Quantity: {item.quantity || 1}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
