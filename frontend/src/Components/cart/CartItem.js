import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CartItem.css";

const CartItem = ({ item, onQuantityChange }) => {
  const { name, description, image, quantity, itemPrice } = item;

  const handleIncrement = () => {
    onQuantityChange(item, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(item, quantity - 1);
    }
  };

  return (
    <li className="list-group-item d-flex align-items-center p-3">
      <img
        src={image || "https://via.placeholder.com/100"}
        alt={name}
        className="rounded me-3"
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
      <div className="flex-grow-1">
        <h5 className="mb-1">{name}</h5>
        <p className="mb-1 text-muted">{description}</p>
        <div>
          <button
            className="btn btn-outline-secondary btn-sm me-2"
            onClick={handleDecrement}
          >
            -
          </button>
          <span className="badge bg-primary me-2">Quantity: {quantity}</span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleIncrement}
          >
            +
          </button>
        </div>
          <span className="badge bg-secondary">Price: ${itemPrice.toFixed(2)}</span>
      </div>
    </li>
  );
};

export default CartItem;
