import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CartItem.css";
import { Plus, Dash, X, Check } from "react-bootstrap-icons";

const CartItem = ({ item, onRemoveItem, updateQuantity }) => {
  const { name, image, quantity, itemPrice, itemId } = item;
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [isEditing, setIsEditing] = useState(false);
  const discountPercentage = 10;
  const discountedPrice = itemPrice * (1 - discountPercentage / 100);

  const handleIncrement = () => {
    setItemQuantity((prevQuantity) => prevQuantity + 1);
    setIsEditing(true);
  };

  const handleDecrement = () => {
    if (itemQuantity > 1) {
      setItemQuantity((prevQuantity) => prevQuantity - 1);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      await updateQuantity(itemId, itemQuantity);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity. You reached the maximum amount in stock!");
      setItemQuantity(quantity);
      setIsEditing(false);
    }
  };

  const handleRemove = () => {
    const confirmRemoval = window.confirm(
      `Are you sure you want to remove "${name}" from your cart?`
    );

    if (confirmRemoval) {
      onRemoveItem(itemId);
    }
  };

  return (
    <li className="list-group-item d-flex align-items-center p-3 rounded shadow-sm">
      <img
        src={image || "https://via.placeholder.com/100"}
        alt={name}
        className="rounded me-3"
        style={{ width: "100px", height: "100px", objectFit: "contain" }}
      />
      <div className="d-flex align-items-center flex-grow-1 justify-content-between">
        <h5 className="fw-bold mb-0 me-3">{name}</h5>
        <div className="d-flex align-items-center me-3">
          <span className="text-decoration-line-through text-danger fw-bold me-2">
            ${itemPrice.toFixed(2)}
          </span>
          <span className="text-success fw-bold">${discountedPrice.toFixed(2)}</span>
        </div>
        <div className="d-flex align-items-center">
          <button
            onClick={handleDecrement}
            className="btn btn-light border rounded-circle d-flex align-items-center justify-content-center me-2"
            style={{ width: "40px", height: "40px" }}
          >
            <Dash size={24} />
          </button>
          <span className="fw-bold mx-2">{itemQuantity}</span>
          <button
            onClick={handleIncrement}
            className="btn btn-light border rounded-circle d-flex align-items-center justify-content-center ms-2"
            style={{ width: "40px", height: "40px" }}
          >
            <Plus size={24} />
          </button>
        </div>
        {isEditing && (
          <button className="btn btn-outline-success border-0 d-flex align-items-center justify-content-center rounded-circle ms-3" 
          style={{ width: "40px", height: "40px" }}
          onClick={handleSave}>

            <Check size={24} />
          </button>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="btn btn-outline-danger border-0 d-flex align-items-center justify-content-center rounded-circle ms-3"
        style={{ width: "40px", height: "40px" }}
      >
        <X size={26} />
      </button>
    </li>
  );
};

export default CartItem;