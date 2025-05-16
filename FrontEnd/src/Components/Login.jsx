

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setError(""); // Clear any previous errors

    try {
      const res = await fetch("https://organic-e-commerce.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store the token and isAdmin flag in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAdmin", data.isAdmin);

        // Redirect based on isAdmin
        if (data.isAdmin) {
          navigate("/admin"); // Admin dashboard URL
        } else {
          navigate("/user-dashboard"); // User dashboard URL
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login">
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          {error && <p style={{ color: "red" }}>{error}</p>}

          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
