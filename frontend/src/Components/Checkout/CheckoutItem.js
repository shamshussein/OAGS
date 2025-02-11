import React from "react";
import "styles/Checkout.css";

const CheckoutItems = ({ cart }) => {
    if (!cart || cart.length === 0) {
        return <p className="empty-cart">Your cart is empty.</p>;
    }
        const discountPercentage = 10;
        return (
      <div className="order-summary p-4 rounded shadow-sm bg-light">
  <h4 className="section-title text-center mb-3 fw-bold">Order Summary</h4>

  <ul className="list-unstyled">
    {cart.map((item) => {
      if (!item.itemId) return null;
      return (
        <li key={item.itemId._id} className="cart-item d-flex justify-content-between align-items-center py-2 border-bottom">
          <div className="item-details">
            <span className="fw-medium" style={{marginLeft:'15px'}}>{item.name}</span> 
            <small className="fw-medium"> (x{item.quantity})</small>
          </div>
          <div className="item-price">
            <span className="text-danger me-2"  style={{textDecoration:'line-through' }}>${item.itemPrice.toFixed(2)}</span>
            <strong className="text-success">${(item.itemPrice * (1 - discountPercentage / 100)).toFixed(2)}</strong>
          </div>
        </li>
      );
    })}
  </ul>
</div>

    );
};

export default CheckoutItems;
