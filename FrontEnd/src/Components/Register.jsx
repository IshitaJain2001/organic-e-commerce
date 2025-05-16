import React, { useState } from "react";
import { toast } from "react-toastify";
// import './Register.css'
const Register = () => {
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [userDetails, setUserDetails] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState(""); // State for OTP
  const [isOtpVerified, setIsOtpVerified] = useState(false);
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleOtpSend = async () => {
    if (!verifiedPhone) {
      return toast.error("Please enter and verify phone number first");
    }

    try {
      const res = await fetch("https://organic-e-commerce.onrender.com/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: verifiedPhone }),
      });

      if (res.ok) {
        toast.success("OTP sent successfully!");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while sending OTP");
    }
  };

  const handleOtpVerify = async () => {
    if (!otp) {
      return toast.error("Please enter OTP");
    }

    const { name, email, password } = userDetails;

    try {
      const res = await fetch("/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, name, email, password, phoneNumber: verifiedPhone }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("OTP verified! Proceeding with registration.");
        setIsOtpVerified(true); // Now OTP is verified
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while verifying OTP");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) {
      return toast.error("Please verify OTP first");
    }
    if (!validateForm()) return toast.error("Please fix form errors");

    const body = { ...userDetails, phone: verifiedPhone };

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Registered successfully!");
        setUserDetails({ name: "", email: "", password: "" });
        setVerifiedPhone("");
        setIsOtpVerified(false); // Reset OTP verified state
      } else {
        toast.error(data.msg || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container">

   
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
        placeholder="Phone number"
        value={verifiedPhone}
        onChange={(e) => setVerifiedPhone(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button type="button" onClick={handleOtpSend} style={{ width: "100%" }}>
        Send OTP
      </button>

      {isOtpVerified ? (
        <p>OTP Verified! You can now register.</p>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button type="button" onClick={handleOtpVerify} style={{ width: "100%" }}>
            Verify OTP
          </button>
        </div>
      )}

      <button type="submit" disabled={!isOtpVerified} style={{ width: "100%" }}>
        Register
      </button>
    </form>
    </div>
  );
};

export default Register;