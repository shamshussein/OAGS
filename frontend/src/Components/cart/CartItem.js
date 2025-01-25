import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CartItem.css";

const CartItem = ({ item }) => {
  const {
    name,
    description,
    image,
    quantity,
    itemPrice,
  } = item;

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
          <span className="badge bg-primary me-2">Quantity: {quantity}</span>
          <span className="badge bg-secondary">Price: ${itemPrice.toFixed(2)}</span>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
