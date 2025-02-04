import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CartItem.css";
import { Plus, Dash, Trash3Fill } from "react-bootstrap-icons";

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
      <li className="list-group-item d-flex align-items-center p-3">
          <img
              src={image || "https://via.placeholder.com/100"}
              alt={name}
              className="rounded me-3"
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
          />
          <div className="flex-grow-1">
              <h5 className="mb-2">{name}</h5>
              <span className="text-decoration-line-through me-2 mb-2" style={{ color: 'red', fontWeight: 'bold', fontSize: '1em' }}>
                  ${itemPrice.toFixed(2)}
              </span>
              <span className="mb-2" style={{ color: 'green', fontWeight: 'bold', fontSize: '1em' }}>
                  ${discountedPrice.toFixed(2)}
              </span>

              <br />
              <div className="mt-2">
                  <Dash onClick={handleDecrement} style={{ color: 'black', fontSize: '1.2em' }} />
                  <span className="badge text-black">Quantity: {itemQuantity}</span>
                  <Plus onClick={handleIncrement} style={{ color: 'black', fontSize: '1.2em' }} />
              </div>
              {isEditing && (
                  <button className="btn btn-secondary mt-2" onClick={handleSave}>
                      Save
                  </button>
              )}
          </div>

          <Trash3Fill
              onClick={handleRemove}
              title="Remove item"
              style={{
                  color: 'red',
                  fontSize: '1.2rem',
              }}
          />
      </li>
  );
};

export default CartItem;