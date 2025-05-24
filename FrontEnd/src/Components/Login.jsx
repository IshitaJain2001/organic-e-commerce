

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Auth.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault(); // Prevent default form submission

//     setError(""); // Clear any previous errors
// console.log("Logging in with:", { email, password });

//     try {
//       const res = await fetch("https://organic-e-commerce.onrender.com/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email:email, password:password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // Store the token and isAdmin flag in localStorage
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("isAdmin", data.user?.isAdmin);
//   const redirectPath = data.redirectTo || "/profile";
//   navigate(redirectPath);
//   console.log(redirectPath);
  
//         // Redirect based on isAdmin
       
//       } else {
//         setError(data.message || "Login failed");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Server error. Please try again later.");
//     }
//   };

//   return (
//     <div className="login">
//       <div className="auth-container">
//         <h2>Login</h2>
//         <form onSubmit={handleLogin} className="auth-form">
//           {error && <p style={{ color: "red" }}>{error}</p>}

//           <label>Email</label>
//           <input
//             type="email"
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//           />

//           <label>Password</label>
//           <input
//             type="password"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//           />

//           <button type="submit">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ Toggle state

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

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
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAdmin", data.user?.isAdmin);
        const redirectPath = data.redirectTo || "/profile";
        navigate(redirectPath);
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
          <div className="password-field" style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ paddingRight: "40px" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px"
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

