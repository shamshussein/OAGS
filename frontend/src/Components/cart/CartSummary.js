import React from 'react';

const CartSummary = ({ total, clearCart }) => (
  <div className="d-flex justify-content-between align-items-center mt-3">
    <h4>Total: ${total.toFixed(2)}</h4>
    <button className="btn btn-secondary" onClick={clearCart}>
      Clear Cart
    </button>
  </div>
);

export default CartSummary;
