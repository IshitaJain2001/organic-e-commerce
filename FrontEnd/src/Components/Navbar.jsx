


import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function NavbarModern() {
  const [open, setOpen] = useState(false);

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
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
