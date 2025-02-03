import React from "react";
import "styles/Checkout.css"; // Import external CSS
 

const CheckoutItems = ({ cart }) => {
  if (cart.length === 0) {
    return <p className="empty-cart">Your cart is empty.</p>;
  }

  return (
    <div className="checkout-items">
      <h2>Checkout Items</h2>
      <ul>
        {cart.map((item) => {
          if (!item || !item.name || !item.itemPrice || !item.quantity) return null;

          const { name, itemPrice, quantity } = item;
          const discountedPrice = itemPrice * 0.9; 

          return (
            <li key={item.productId} className="cart-item">
              <span className="item-name">{name} (x{quantity})</span>
              <span className="item-price">
                <span className="original-price">${itemPrice.toFixed(2)}</span> 
                <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CheckoutItems;
