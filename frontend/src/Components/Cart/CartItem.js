import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CartItem.css";
import { Plus, Dash, Check } from "react-bootstrap-icons";

const CartItem = ({ item, onRemoveItem, updateQuantity }) => {
  const { name, image, quantity, itemPrice, itemId, itemType } = item;
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const [isEditing, setIsEditing] = useState(false);

  const isBundle = itemType === "bundle";
  const discountPercentage = 10;
  const discountedPrice = itemPrice * (1 - discountPercentage / 100);

  const productBadges = [
    { text: "Top Pick", color: "bg-primary text-white" },
    { text: "Flash Sale", color: "bg-danger text-white" },
    { text: "Limited Stock", color: "bg-warning text-dark" },
    { text: "Trending", color: "bg-info text-dark" },
    { text: "Best Seller", color: "bg-success text-white" },
  ];

  const getRandomBadge = () => productBadges[Math.floor(Math.random() * productBadges.length)];

  const [badge, setBadge] = useState(() => getRandomBadge());

  useEffect(() => {
    if (isBundle) {
      setBadge({ text: "Bundle Offer", color: "bg-warning text-dark" });
    }
  }, [isBundle]);

  const handleIncrement = () => {
    setItemQuantity((prev) => prev + 1);
    setIsEditing(true);
  };

  const handleDecrement = () => {
    if (itemQuantity > 1) {
      setItemQuantity((prev) => prev - 1);
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
    if (window.confirm(`Are you sure you want to remove "${name}" from your cart?`)) {
      onRemoveItem(itemId);
    }
  };

  return (
    <div
      className={`card mb-4 cart-item shadow-sm ${isBundle ? "bundle-item" : ""}`}
      style={{
        border: isBundle ? "2px solid #ff9800" : "1px solid #ddd",
        backgroundColor: isBundle ? "#fffaf2" : "#fff",
        padding: "10px",
        borderRadius: "12px",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <div className="row g-0 align-items-center">
        <div className="col-md-3 d-flex justify-content-center position-relative">
          <span
            className={`badge ${badge.color}`}
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              fontSize: "0.8rem",
              fontWeight: "bold",
              padding: "5px 10px",
              borderRadius: "8px",
            }}
          >
            {badge.text}
          </span>
          <img
            src={image || "https://via.placeholder.com/150"}
            alt={name}
            className="img-fluid p-3 product-image"
            style={{
              // width: isBundle ? "190px" : "105px",
              // height: isBundle ? "130px" : "140px",
              // objectFit: "cover",
              // borderRadius: "8px",
            }}
          />
        </div>

        <div className="col-md-9">
          <div className="card-body d-flex flex-column justify-content-between h-100">
            <h5 className="card-title fw-bold">{name}</h5>
            <p className="card-text mb-2">
              <span className="text-decoration-line-through text-danger me-2 old-price">
                ${itemPrice.toFixed(2)}
              </span>
              <span
                className="fw-bold"
                style={{
                  color: "#28a745",
                  fontSize: isBundle ? "1.2rem" : "1rem",
                }}
              >
                ${discountedPrice.toFixed(2)}
              </span>
            </p>
            {isBundle && <p className="text-muted small">Includes multiple items!</p>}

            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3 quantity-controls">
                <button
                  onClick={handleDecrement}
                  className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "1.2rem",
                    borderWidth: "2px",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <Dash size={24} />
                </button>

                <span className="fw-bold text-center" style={{ minWidth: "45px", fontSize: "1.2rem", color: "#333" }}>
                  {itemQuantity}
                </span>

                <button
                  onClick={handleIncrement}
                  className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: "50px",
                    height: "50px",
                    fontSize: "1.2rem",
                    borderWidth: "2px",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <Plus size={24} />
                </button>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="btn btn-outline-success rounded-circle d-flex align-items-center justify-content-center shadow-sm ms-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "1.2rem",
                      borderWidth: "2px",
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    <Check size={24} />
                  </button>
                )}
              </div>

              <button onClick={handleRemove} className="btn btn-danger remove-btn" style={{ fontSize: "0.9rem", padding: "8px 12px", borderRadius: "8px" }}>
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
