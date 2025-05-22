import React, { useState, useEffect } from 'react';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  // Fetch all products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');  // Your API route here
    const data = await res.json();
    setProducts(data);
  };

  // Add product
  const addProduct = async () => {
    await fetch('/api/add-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    setNewProduct({ name: '', price: '' });
    fetchProducts();  // refresh product list
  };

  // Delete product by id
  const deleteProduct = async (id) => {
    await fetch(`/api/delete-product/${id}`, {
      method: 'DELETE',
    });
    fetchProducts();  // refresh product list
  };

  return (
    <div>
      <h2>Admin Panel - Products</h2>

      <div>
        <input
          placeholder="Product Name"
          value={newProduct.name}
          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          placeholder="Price"
          value={newProduct.price}
          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <button onClick={addProduct}>Add Product</button>
      </div>

      <table border="1" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr><th>Name</th><th>Price</th><th>Action</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>
                <button onClick={() => deleteProduct(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
