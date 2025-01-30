import React, {useState} from "react";
import { Trash } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CartItem.css";

const CartItem = ({ item, onRemoveItem }) => {
  const { name, description, image, quantity, itemPrice,} = item;
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const discountPercentage=10;
  const discountedPrice = itemPrice * (1 - discountPercentage / 100);
  const handleIncrement = () => {
    setItemQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setItemQuantity(quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemoveItem(item.itemId); 
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
        <span className="me-2" style={{color:"#0e744d",textDecoration:"line-through"}}>
          ${itemPrice.toFixed(2)}
        </span>
        <span className="me-2" style={{color:"#a50202"}}>
          ${discountedPrice.toFixed(2)}
        </span>

        <p className="mb-1 text-black">{description}</p>
        <div>
          <button
            className="btn btn-outline-secondary btn-sm me-2"
            onClick={handleDecrement}
          >
            -
          </button>
          <span className="text-black me-2">Quantity: {itemQuantity}</span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleIncrement}
          >
            +
          </button>
        </div>
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
