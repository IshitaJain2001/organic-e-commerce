import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../cartActions";
import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState({ products: [] });
  const dispatch = useDispatch();

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

  const handleAddToCart = async (productIndex) => {
    const updatedProducts = [...products.products];
    const selectedProduct = updatedProducts[productIndex];

    if (selectedProduct.productCount > 0) {
      selectedProduct.productCount -= 1;
      setProducts({ products: updatedProducts });

      dispatch(addToCart(selectedProduct));

      alert("Product added to cart!");

      await fetch("https://organic-e-commerce.onrender.com/update-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: selectedProduct._id, quantity: 1 }),
      });
    } else {
      alert("Out of stock!");
    }
  };

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
              <button onClick={() => handleAddToCart(index)} className="add-to-cart-btn">
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="empty-message">No products available</p>
        )}
      </div>
    </section>
  );
}
