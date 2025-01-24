import React from 'react';
import './CartSummary.css'; // Styles for CartSummary

const CartSummary = ({ total, clearCart }) => (
  <div className="cart-summary d-flex justify-content-between align-items-center mt-4">
    <h4>Total: ${total.toFixed(2)}</h4>
    <button className="btn btn-danger" onClick={clearCart}>
      Clear Cart
    </button>
    <button className="btn btn-primary">Proceed to Checkout</button>
  </div>
);

export default CartSummary;
