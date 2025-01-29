import React, { useState } from "react";
import { Trash } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CartItem.css";

const CartItem = ({ item, onRemoveItem, updateQuantity }) => {
  const { name, description, image, quantity, itemPrice, itemId } = item;
  const [itemQuantity, setItemQuantity] = useState(quantity);

  const handleIncrement = async () => {
    const newQuantity = itemQuantity + 1;
    setItemQuantity(newQuantity);
    await updateQuantity(itemId, newQuantity);
  };

  const handleDecrement = async () => {
    if (itemQuantity > 1) {
      const newQuantity = itemQuantity - 1;
      setItemQuantity(newQuantity);
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemove = () => {
    const confirmRemoval = window.confirm(
      `Are you sure you want to remove "${name}" from your cart?`
    );

    if (confirmRemoval) {
      onRemoveItem(itemId);
      window.location.reload();

    }
  };

  return (
    <li className="list-group-item d-flex align-items-center p-3">
      <img
        src={image || "https://via.placeholder.com/100"}
        alt={name}
        className="rounded me-3"
        style={{ width: "100px", height: "100px", objectFit: "contain" }}
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
          <span className="badge bg-primary me-2">Quantity: {itemQuantity}</span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleIncrement}
          >
            +
          </button>
        </div>
        <span className="badge bg-secondary me-2">
          Price: ${itemPrice.toFixed(2)}
        </span>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleRemove}
          title="Remove item"
        >
          <Trash />
        </button>
      </div>
    </li>
  );
};

export default CartItem;
