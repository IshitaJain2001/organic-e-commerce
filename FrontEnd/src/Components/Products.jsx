import { useEffect, useState } from "react";
import "./Products.css"; // ✅ Import the CSS file

export default function Products() {
  const [products, setProducts] = useState({ products: [] });

  useEffect(() => {
    async function getData() {
      try {
        let data = await fetch("https://organic-e-commerce.onrender.com/check-products");
        let res = await data.json();
        setProducts(res);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }

    getData();
  }, []);

  let productList = products.products || [];

  return (
    <section className="products-section">
      <h2 className="section-title">Featured Products</h2>

      <div className="product-list">
        {productList.length > 0 ? (
          productList.map((product, index) => (
            <div key={index} className="product-card">
              <h3>{product.name}</h3>
              <p className="price">₹{product.price}</p>
              <p className="stock">In Stock: {product.productCount}</p>
            </div>
          ))
        ) : (
          <p className="empty-message">No products available</p>
        )}
      </div>
    </section>
  );
}
