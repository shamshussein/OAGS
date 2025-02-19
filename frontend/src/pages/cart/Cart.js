import React, { useEffect, useState, useCallback } from "react";
import CartItem from "Components/Cart/CartItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import API_BASE_URL from "config";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCartItems = useCallback(async () => {
    try {
      if (!user || !user.userID) {
        console.error("User is not logged in or userID is missing.");
        return; 
      }
      const response = await axios.get(
        `${API_BASE_URL}/api/carts/getCartItems?userId=${user.userID}`
      );
      setCartItems(response.data.cartItems || []);
      setTotalPrice(response.data.totalPrice || 0);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleProceedToCheckout = () => {
    navigate("/checkout", { state: { cartItems, totalPrice } });
  };

  const handleRemoveItem = async (itemId) => {
    try {
      if (!user || !user.token) {
        console.error("User is not logged in.");
        return;
      }
      await axios.post(
        `${API_BASE_URL}/api/carts/removeItem`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setCartItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));
      window.location.reload();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleClearCart = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear your cart? This action cannot be undone."
    );
    if (!confirmClear) return;

    try {
      if (!user || !user.token) {
        console.error("User is not logged in.");
        return;
      }
      await axios.post(
        `${API_BASE_URL}/api/carts/clearCart`,
        { userID: user.userID },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setCartItems([]);
      setTotalPrice(0);
      window.location.reload();

    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    try {
      if (!user || !user.token) {
        console.error("User is not logged in.");
        return;
      }
      const response = await axios.post(
        `${API_BASE_URL}/api/carts/updateCartItemQuantity`,
        { itemId, newQuantity },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.itemId === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        alert(response.data.message || "Failed to update quantity.");
        fetchCartItems();
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      alert(error.response?.data?.message || "Failed to update quantity.");
      fetchCartItems();
    }
    window.location.reload();
  };

  const discount = totalPrice * 0.1;
  const deliveryFee = cartItems.length > 0 ? 5.99 : 0;
  const finalTotal = totalPrice - discount + deliveryFee;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container my-5" style={{ minHeight: "50vh" }}>
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-lg mb-4" style={{ border: "none" }}>
            <div className="mt-5 text-black">
              <h2 className="text-center mb-0" style={{ fontSize: "1.7em", fontWeight: "bold" }}>
                Your Cart
              </h2>
            </div>
            <div className="card-body">
              {cartItems.length === 0 ? (
                <p className="text-center text-muted">Your cart is empty.</p>
              ) : (
                <ul className="list-group mb-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.itemId}
                      item={item}
                      updateQuantity={updateCartItemQuantity}
                      onRemoveItem={handleRemoveItem}
                      maxQuantity={item.maxQuantity}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          {cartItems.length > 0 && (
            <div className="card shadow-lg" style={{ border: "none", backgroundColor: "#f9f9f9" }}>
              <div className="mt-5 text-black">
                <h3 className="text-center mb-0" style={{ fontSize: "1.7em", fontWeight: "bold" }}>
                  Summary
                </h3>
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
                <div className="text-center">
                  {cartItems.length > 0 && (
                    <button
                      className="btn btn-success mt-3 mb-2 ml-2 mr-2 w-100"
                      style={{ backgroundColor: "", border: "none" }}
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                    </button>
                  )}
                  <button
                    className="btn btn-danger text-center mb-5 ml-2 mr-2 w-100"
                    style={{ backgroundColor: "", border: "none" }}
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;