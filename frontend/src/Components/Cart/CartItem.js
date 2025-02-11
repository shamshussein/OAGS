import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CartItem.css";
import { Plus, Dash, Check } from "react-bootstrap-icons";

const CartItem = ({ item, onRemoveItem, updateQuantity }) => {
  const { name, image, quantity, itemPrice, description, itemId } = item;
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
              <h6 className="text-muted fw-bold">{description}</h6>
                <span className="text-decoration-line-through text-danger me-2 old-price">
                  ${itemPrice.toFixed(2)}
                </span>
                <span className="text-success fw-bold new-price">
                  ${discountedPrice.toFixed(2)}
                </span>
              </p>
            </div>
            <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3 quantity-controls">
            {/* Decrement Button */}
            <button
              onClick={handleDecrement}
              className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: "45px",
                height: "45px",
                fontSize: "1.2rem",
                borderWidth: "2px",
                transition: "all 0.3s ease-in-out",
              }}
             
            >
              <Dash size={22} />
            </button>

            {/* Quantity Display */}
            <span
              className="fw-bold text-center"
              style={{
                minWidth: "40px",
                fontSize: "1rem",
                color: "#333",
              }}
            >
              {itemQuantity}
            </span>

            {/* Increment Button */}
            <button
              onClick={handleIncrement}
              className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: "45px",
                height: "45px",
                fontSize: "1.2rem",
                borderWidth: "2px",
                transition: "all 0.3s ease-in-out",
              }}
             
            >
              <Plus size={22} />
            </button>

            {isEditing && (
            <button
              onClick={handleSave}
              className="btn btn-outline-success rounded-circle d-flex align-items-center justify-content-center shadow-sm ms-3"
              style={{
                width: "45px",
                height: "45px",
                fontSize: "1.2rem",
                borderWidth: "2px",
                transition: "all 0.3s ease-in-out",
              }}
    
            >
              <Check size={22} />
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
