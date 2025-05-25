

import React from "react";
import "./ProfileCard.css";

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-container">
      <h2 className="profile-heading">Welcome, {user?.name || "User"} 👋</h2>

      <div className="profile-info">
        <p><strong>ID:</strong> {user?.id}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {user?.phone || "Not provided"}</p>
        <p><strong>Address:</strong> {user?.address || "Not provided"}</p>
      </div>

      <div className="section">
        <h3>🛒 Cart Details</h3>
   
        <p>You have {user?.cart?.length || 0} items in your cart.</p>
      </div>

      <div className="section">
        <h3>📦 Order History</h3>

        <p>{user?.orders?.length || 0} orders placed.</p>
      </div>
    </div>
  );
};

export default ProfileCard;
