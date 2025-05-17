

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "./Navbar.css";
// import { useSelector } from "react-redux";

// export default function NavbarModern() {
//   const [open, setOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);

//   useEffect(() => {
//     let cart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCartCount(cart.length);
//   }, []);

//   const menu = [
//     { to: "/home", label: "Home" },
//     { to: "/shop", label: "Shop" },
//     { to: "/about", label: "About" },
//     { to: "/contact", label: "Contact" },
//   ];

//   const authLinks = [
//     { to: "/login", label: "Login" },
//     { to: "/register", label: "Register" },
//   ];

//   return (
//     <header className={`navbar-modern ${open ? "open" : ""}`}>
//       <div className="logo">Organic Works</div>

//       <nav className={`nav-links ${open ? "open" : ""}`}>
//         {menu.map((item) => (
//           <Link
//             key={item.to}
//             to={item.to}
//             className="nav-item"
//             onClick={() => setOpen(false)}
//           >
//             {item.label}
//           </Link>
//         ))}

//         <Link to="/cart" className="nav-item">
//           🛒 Cart ({cartCount})
//         </Link>

//         <div className="auth-links">
//           {authLinks.map((item) => (
//             <Link
//               key={item.to}
//               to={item.to}
//               className="nav-item auth-item"
//               onClick={() => setOpen(false)}
//             >
//               {item.label}
//             </Link>
//           ))}
//         </div>
//       </nav>

//       <button
//         className={`hamburger ${open ? "active" : ""}`}
//         onClick={() => setOpen((o) => !o)}
//         aria-label="Toggle menu"
//       >
//         <span></span>
//         <span></span>
//         <span></span>
//       </button>
//     </header>
//   );
// }



import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useSelector } from "react-redux";

export default function NavbarModern() {
  const [open, setOpen] = useState(false);

  // ✅ Get cart count directly from Redux
  const cartCount = useSelector((state) => state.cart.items.length);

  const menu = [
    { to: "/home", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const authLinks = [
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
  ];

  return (
    <header className={`navbar-modern ${open ? "open" : ""}`}>
      <div className="logo">Organic Works</div>

      <nav className={`nav-links ${open ? "open" : ""}`}>
        {menu.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="nav-item"
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}

        <Link to="/cart" className="nav-item" onClick={() => setOpen(false)}>
          🛒 Cart ({cartCount})
        </Link>

        <div className="auth-links">
          {authLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-item auth-item"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <button
        className={`hamburger ${open ? "active" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
