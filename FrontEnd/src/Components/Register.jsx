


import React, { useState } from "react";
import { toast } from "react-toastify";

const Register = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!userDetails.name) newErrors.name = "Name is required";
    if (!userDetails.email || !/\S+@\S+\.\S+/.test(userDetails.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!userDetails.password || userDetails.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!userDetails.phone || !/^\d{10}$/.test(userDetails.phone)) {
      newErrors.phone = "Valid 10-digit phone number required";
    }
    if (!userDetails.address) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return toast.error("Please fix form errors");

    const body = { ...userDetails };

    try {
      const res = await fetch("https://organic-e-commerce.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
       if (!res.ok) {
      // 🔴 Alert if user already exists or other error
      alert(result.message || "Registration failed");
      return;
    }
      if (res.ok) {
        toast.success("Registered successfully!");
        setUserDetails({ name: "", email: "", password: "", address: "", phone: "" });
      } else {
        toast.error(data.msg || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <form onSubmit={handleRegister} style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
        <h2>Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={userDetails.name}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userDetails.email}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userDetails.password}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={userDetails.phone}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}

        <textarea
          name="address"
          placeholder="Address"
          value={userDetails.address}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}

        <button type="submit" style={{ width: "100%" }}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
