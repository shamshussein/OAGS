import React, { useEffect } from "react";
import { useCart } from "contexts/CartContext";
import CartItem from "Components/cart/CartItem";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
  const { cartItems, totalPrice, fetchCartItems } = useCart();

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  return (
    <div className="container my-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h2 className="text-center mb-0">Your Cart</h2>
        </div>
        <div className="card-body">
          {cartItems.length === 0 ? (
            <p className="text-center text-muted">Your cart is empty.</p>
          ) : (
            <div>
              <ul className="list-group mb-4">
                {cartItems.map((item, index) => (
                  <CartItem key={index} item={item} />
                ))}
              </ul>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <h4 className="mb-0">Total Price:</h4>
                <h4 className="text-success mb-0">${totalPrice.toFixed(2)}</h4>
              </div>
            </div>
          )}
        </div>
        <div className="card-footer text-center">
          <button className="btn btn-success">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
