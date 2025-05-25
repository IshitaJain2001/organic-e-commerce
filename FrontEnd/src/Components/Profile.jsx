


import React, { useEffect, useState } from "react";
import "./ProfileCard.css";

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

  if (!user) {
    return (
      <div style={{ marginTop: "100px", textAlign: "center", color: "#666", fontSize: "18px" }}>
        <p>Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2 className="profile-heading">My Profile</h2>

      <div className="profile-info">
        <p><strong>ID:</strong> {user?.id}</p>
        <p><strong>Phone:</strong> {user?.phone || "Not provided"}</p>
        <p><strong>Address:</strong> {user?.address || "Not provided"}</p>
      </div>

      <div className="section">
        <h3>🛒 Cart Items</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
            {cart.map((item, i) => (
              <li key={i}>{item.name} — {item.quantity} pcs</li>
            ))}
          </ul>
        )}
      </div>

      <div className="section">
        <h3>📦 Order History</h3>
        {orders.length === 0 ? (
          <p>No previous orders found.</p>
        ) : (
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
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
