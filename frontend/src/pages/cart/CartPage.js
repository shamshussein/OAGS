import React, { useState, useEffect } from 'react';

function Cart() {
  const [cart, setCart] = useState([]);

  // Load the cart from localStorage when the component mounts
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  // Update the cart in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Handle quantity change
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      alert('Quantity must be at least 1.');
      return;
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove item from cart
  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="container mt-5">
      <h2>Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="row mb-3 align-items-center">
              <div className="col-md-2">
                <img src={item.image} alt={item.productName} className="img-fluid" />
              </div>
              <div className="col-md-4">
                <h5>{item.productName}</h5>
                <p className="text-muted">{item.productDescription}</p>
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="col-md-2">
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="row mt-4">
            <div className="col-md-6"></div>
            <div className="col-md-6 text-end">
              <h4>Total: ${calculateTotalPrice()}</h4>
              <button className="btn btn-primary mt-3">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
