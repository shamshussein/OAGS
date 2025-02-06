import React from "react";
import "styles/Checkout.css";

const CheckoutItems = ({ cart }) => {
    if (!cart || cart.length === 0) {
        return <p className="empty-cart">Your cart is empty.</p>;
    }

    return (
        <div className="order-summary">
            <h4 className="section-title">Order Summary</h4>
            <ul>
                {cart.map((item) => {
                    if (!item.itemId) return null;

                    return (
                        <li key={item.itemId._id} className="cart-item">
                            <span className="item-name">{item.name} (x{item.quantity})</span>
                            <span className="item-price">
                                <span className="original-price">${item.itemPrice}</span>
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default CheckoutItems;
