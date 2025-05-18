import React, { useState, useEffect } from "react";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("https://organic-e-commerce.onrender.com/cart");
        if (!response.ok) {
          throw new Error("Failed to fetch cart items.");
        }
        const data = await response.json();
        console.log("Fetched cart items:", data);

        const items = data.cart?.items || [];
        setCartItems(Array.isArray(items) ? items : []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setIsLoading(false);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await fetch(`https://organic-e-commerce.onrender.com/remove-from-cart/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to remove item from cart.");
      }
      const data = await response.json();
      console.log("Updated cart after removing item:", data);
      setCartItems(data.cart?.items || []);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      const response = await fetch(
        `https://organic-e-commerce.onrender.com/update-cart/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update cart quantity.");
      }
      const data = await response.json();
      console.log("Updated cart after quantity change:", data);
      setCartItems(data.cart?.items || []);
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="cart-section" style={{ marginTop: "100px" }}>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Nothing in Cart</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.productId._id}>
              <h3>{item.productId?.name}</h3>
              <p>Price: ₹{item.productId?.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button onClick={() => handleRemoveFromCart(item.productId._id)}>
                Remove
              </button>
              <button
                onClick={() =>
                  handleUpdateQuantity(item.productId._id, item.quantity + 1)
                }
              >
                Increase Quantity
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
