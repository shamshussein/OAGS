import React, { useEffect, useState } from "react";
import axios from "axios";
import CartItem from 'Components/cart/CartItem';
import "bootstrap/dist/css/bootstrap.min.css";
// import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.userID) {
          console.error("User is not logged in or userID is missing.");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/api/carts/getCartItems?userId=${user.userID}`
        );

        setCartItems(response.data.cartItems || []);
        setTotalPrice(response.data.totalPrice || 0);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

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
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Total Price:</h4>
                <h4 className="text-success mb-0">${totalPrice}</h4>
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
