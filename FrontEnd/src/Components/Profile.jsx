import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    console.log("Logged in user:", storedUser);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  
//   useEffect(() => {
//     if (user?.id) {
//       // ✅ Cart
//       fetch(`https://organic-e-commerce.onrender.com/cart/${user.id}`)
//         .then((res) => res.json())
//         .then((data) => setCart(data.cart || []))
//         .catch((err) => console.error("Cart fetch error:", err));

//       ✅ Orders
//       fetch(`https://organic-e-commerce.onrender.com/orders/${user.id}`)
//         .then((res) => res.json())
//         .then((data) => setOrders(data.orders || []))
//         .catch((err) => console.error("Orders fetch error:", err));
//     }
//   }, [user]);

  if (!user) {
    return (
      <div style={{marginTop:"100px"}}>
        <p className="text-lg text-gray-600">Please login to view your profile</p>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">My Profile</h2>

      <div className="space-y-4">
        <p><strong>ID:</strong> {user?.id}</p>
        <p><strong>Phone:</strong> {user?.phone || "Not provided"}</p>
        <p><strong>Address:</strong> {user?.address || "Not provided"}</p>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-indigo-600 mb-2">🛒 Cart Items</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="list-disc pl-5">
            {cart.map((item, i) => (
              <li key={i}>{item.name} — {item.quantity} pcs</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-indigo-600 mb-2">📦 Order History</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">No previous orders found.</p>
        ) : (
          <ul className="list-disc pl-5">
            {orders.map((order, i) => (
              <li key={i}>Order #{order._id} — ₹{order.total} — {order.status}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
