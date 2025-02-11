import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CartItem.css";
import { Plus, Dash, Check } from "react-bootstrap-icons";

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
    <div className="card mb-4 cart-item">
      <div className="row g-0">
        <div className="col-md-3 d-flex align-items-center justify-content-center">
          <img
            src={image || "https://via.placeholder.com/150"}
            alt={name}
            className="img-fluid p-3 product-image"
          />
        </div>
        <div className="col-md-9">
          <div className="card-body d-flex flex-column justify-content-between h-100">
            <div>
              <h5 className="card-title fw-bold">{name}</h5>
              <p className="card-text mb-1">
                <span className="text-decoration-line-through text-danger me-2 old-price">
                  ${itemPrice.toFixed(2)}
                </span>
                <span className="text-success fw-bold new-price">
                  ${discountedPrice.toFixed(2)}
                </span>
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center quantity-controls">
                <button
                  onClick={handleDecrement}
                  className="btn btn-outline-secondary rounded-circle me-2"
                  style={{ width: "45px", height: "40px" }}
                >
                  <Dash size={20} />
                </button>
                <span className="fw-bold item-quantity">{itemQuantity}</span>
                <button
                  onClick={handleIncrement}
                  className="btn btn-outline-secondary rounded-circle ms-2"
                  style={{ width: "45px", height: "40px" }}
                >
                  <Plus size={20} />
                </button>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="btn btn-outline-success rounded-circle ms-3"
                    style={{ width: "45px", height: "40px" }}
                  >
                    <Check size={20} />
                  </button>
                )}
              </div>
              <button
                  onClick={handleRemove}
                  className="btn btn-danger remove-btn"
                >
                  Remove
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
