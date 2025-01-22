import React from 'react';

const CartItem = ({ item, removeFromCart }) => (
  <li className="list-group-item d-flex justify-content-between align-items-center">
    <div>
      <h5>{item.productName}</h5>
      <p>Price: ${item.productPrice.toFixed(2)}</p>
      <p>Quantity: {item.quantity}</p>
    </div>
    <button className="btn btn-danger" onClick={() => removeFromCart(item._id)}>
      Remove
    </button>
  </li>
);

export default CartItem;
