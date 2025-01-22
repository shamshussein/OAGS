// pages/cart/CartBody.js
import React from 'react';
import { useCart } from './Cart';  // Import the useCart hook
import './CartBody.css';  // Style for the CartBody component

function CartBody() {
  const { cartItems, removeFromCart } = useCart(); // Get cart items and remove function

  // If the cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="cart-body">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div className="cart-item" key={index}>
            <div className="item-details">
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove from Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h4>Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h4>
      </div>

      <div className="cart-actions">
        <button className="btn btn-secondary">Proceed to Checkout</button>
      </div>
    </div>
  );
}

export default CartBody;
