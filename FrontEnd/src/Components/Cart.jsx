
// import React, { useEffect, useState } from "react";

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchCart = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:3000/cart",{
//          credentials: "include", 
//       });
//       const data = await res.json();
//       setCartItems(data.cart.items || []);
//     } catch (err) {
//       console.error("Error fetching cart:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const removeFromCart = async (productId) => {
//     try {
//       await fetch(`http://localhost:3000/remove-from-cart/${productId}`, {
//         method: "DELETE",
//       });
//       fetchCart();
//     } catch (err) {
//       console.error("Error removing item:", err);
//     }
//   };

//   const updateQuantity = async (productId, quantity) => {
//     try {
//       await fetch(`http://localhost:3000/update-cart/${productId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ quantity }),
//       });
//       fetchCart();
//     } catch (err) {
//       console.error("Error updating quantity:", err);
//     }
//   };

//   const totalPrice = cartItems.reduce(
//     (acc, item) => acc + item.productId.price * item.quantity,
//     0
//   );

//   return (
//     <div style={{marginTop:"100px"}}>
//       <h2 className="text-2xl font-bold mb-6 text-center">Your Cart</h2>
//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : cartItems.length === 0 ? (
//         <p className="text-center">Cart is empty</p>
//       ) : (
//         <div className="space-y-4">
//           {cartItems.map((item) => (
//             <div
//               key={item.productId._id}
//               className="flex justify-between items-center border p-4 rounded shadow"
//             >
//               <div>
//                 <h3 className="font-semibold text-lg">{item.productId.name}</h3>
//                 <p>Price: ₹{item.productId.price}</p>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() =>
//                     updateQuantity(
//                       item.productId._id,
//                       item.quantity > 1 ? item.quantity - 1 : 1
//                     )
//                   }
//                   className="bg-gray-200 px-2 rounded"
//                 >
//                   -
//                 </button>
//                 <span>{item.quantity}</span>
//                 <button
//                   onClick={() =>
//                     updateQuantity(item.productId._id, item.quantity + 1)
//                   }
//                   className="bg-gray-200 px-2 rounded"
//                 >
//                   +
//                 </button>
//                 <button
//                   onClick={() => removeFromCart(item.productId._id)}
//                   className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//           <div className="text-right font-semibold text-xl">
//             Total: ₹{totalPrice}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;



import React, { useEffect, useState } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/cart", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Cart fetch failed");
      const data = await res.json();
      setCartItems(data.cart.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      await fetch(`http://localhost:3000/cart/remove/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await fetch(`http://localhost:3000/cart/update/${productId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  return (
    <div style={{ marginTop: "100px" }}>
      <h2 className="text-2xl font-bold mb-6 text-center">Your Cart</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-center">Cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productId._id}
              className="flex justify-between items-center border p-4 rounded shadow"
            >
              <div>
                <h3 className="font-semibold text-lg">{item.productId.name}</h3>
                <p>Price: ₹{item.productId.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId._id,
                      item.quantity > 1 ? item.quantity - 1 : 1
                    )
                  }
                  className="bg-gray-200 px-2 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId._id, item.quantity + 1)
                  }
                  className="bg-gray-200 px-2 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.productId._id)}
                  className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-right font-semibold text-xl">
            Total: ₹{totalPrice}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

