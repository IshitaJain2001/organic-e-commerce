

import React, { useState } from "react";
import { toast } from "react-toastify";

const Register = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
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

    if (!userDetails.houseNumber) newErrors.houseNumber = "House number is required";
    if (!userDetails.street) newErrors.street = "Street is required";
    if (!userDetails.city) newErrors.city = "City is required";
    if (!userDetails.state) newErrors.state = "State is required";
    if (!userDetails.pincode || !/^\d{6}$/.test(userDetails.pincode)) {
      newErrors.pincode = "Valid 6-digit pincode is required";
    }

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

    const fullAddress = `${userDetails.houseNumber}, ${userDetails.street}, ${userDetails.city}, ${userDetails.state} - ${userDetails.pincode}`;
    
    const body = {
      name: userDetails.name,
      email: userDetails.email,
      password: userDetails.password,
      phone: userDetails.phone,
      address: fullAddress
    };

    try {
      const res = await fetch("https://organic-e-commerce.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) {
 toast.error(data.message || "Registration failed"); 
        return;
      }

      toast.success("Registered successfully!");
      setUserDetails({
        name: "",
        email: "",
        password: "",
        phone: "",
        houseNumber: "",
        street: "",
        city: "",
        state: "",
        pincode: ""
      });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <form
        onSubmit={handleRegister}
        style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}
      >
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

        <input
          type="text"
          name="houseNumber"
          placeholder="House Number"
          value={userDetails.houseNumber}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        {errors.houseNumber && <p style={{ color: "red" }}>{errors.houseNumber}</p>}

        <input
          type="text"
          name="street"
          placeholder="Street"
          value={userDetails.street}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        {errors.street && <p style={{ color: "red" }}>{errors.street}</p>}

        <input
          type="text"
          name="city"
          placeholder="City"
          value={userDetails.city}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        {errors.city && <p style={{ color: "red" }}>{errors.city}</p>}

        <input
          type="text"
          name="state"
          placeholder="State"
          value={userDetails.state}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        {errors.state && <p style={{ color: "red" }}>{errors.state}</p>}

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={userDetails.pincode}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        {errors.pincode && <p style={{ color: "red" }}>{errors.pincode}</p>}

        <button type="submit" style={{ width: "100%" }}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
