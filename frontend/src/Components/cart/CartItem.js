import React from 'react';
import './CartItem.css'; // Styles for CartItem

const CartItem = ({ item, removeFromCart }) => (
  <li className="list-group-item d-flex justify-content-between align-items-center">
    <div className="item-details">
      <img src={item.image} alt={item.productName} className="item-image img-fluid me-3" />
      <div>
        <h5>{item.productName}</h5>
        <p>Price: ${item.productPrice.toFixed(2)}</p>
        <p>Quantity: {item.quantity}</p>
      </div>
    </div>
    <button className="btn btn-danger" onClick={() => removeFromCart(item._id)}>
      Remove
    </button>
  </li>
);

export default CartItem;
