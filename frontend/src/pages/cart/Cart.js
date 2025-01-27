import React, { useEffect } from "react";
import { useCart } from "contexts/CartContext";
import CartItem from "Components/cart/CartItem";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
  const { cartItems, setCartItems, totalPrice, fetchCartItems } = useCart();

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const updateCartInLocalStorage = (updatedCart) => {
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (item, newQuantity) => {
    const updatedCart = cartItems.map((cartItem) =>
      cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
    );
    setCartItems(updatedCart);
    updateCartInLocalStorage(updatedCart);
  };

  const discount = totalPrice * 0.1;
  const deliveryFee = cartItems.length > 0 ? 5.99 : 0;
  const finalTotal = totalPrice - discount + deliveryFee;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-lg mb-4">
            <div className="card-header bg-primary text-white">
              <h2 className="text-center mb-0">Your Cart</h2>
            </div>
            <div className="card-body">
              {cartItems.length === 0 ? (
                <p className="text-center text-muted">Your cart is empty.</p>
              ) : (
                <ul className="list-group mb-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </ul>
              )}
            </div>
            <div className="card-footer text-center">
              <button className="btn btn-success">Proceed to Checkout</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-lg">
            <div className="card-header bg-secondary text-white">
              <h3 className="text-center mb-0">Order Summary</h3>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total Quantity:</span>
                  <span>{totalQuantity}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Delivery / Taxes:</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between font-weight-bold">
                  <span>Final Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
