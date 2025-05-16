

import React, { useState, useEffect } from "react";
import "./HerosSection.css";
import natureimg1 from "../assets/nature-1.jpg"
import natureimg2 from "../assets/nature-2.webp";
import natureimg3 from "../assets/nature-2.avif";

export default function HerosSection() {
  const items = ["Skin", "Hair", "Health"];
  const images = [natureimg1, natureimg2, natureimg3];

  const [index, setIndex] = useState(0); 
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % items.length); 
        setFade(true);
      }, 500); 
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${images[index]})` }}
    >
      <div className="hero-overlay">
        <h1 className="hero-title">Welcome to Organic Works</h1>
        <p className={`hero-subtitle ${fade ? "fade-in" : "fade-out"}`}>
          Best Products for Your <span className="highlight-word">{items[index]}</span>
        </p>
        <button className="cta-btn">Shop Now</button>
      </div>
    </section>
  );
}
