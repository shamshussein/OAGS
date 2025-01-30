import React, { useEffect, useState } from "react";
import CartItem from "Components/cart/CartItem";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
 
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

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        console.error("User is not logged in.");
        return;
      }
  
      await axios.post(
        `http://localhost:3000/api/carts/removeItem`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, 
          },
        }
      );
  
      fetchCartItems(); 
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
  const handleClearCart = async (userID) => {
    try {
      if (!user || !user.token) {
        console.error("User is not logged in.");
        return;
      }
     userID = user.userID;
     console.log("user id: " + userID);

      await axios.post(
        `http://localhost:3000/api/carts/clearCart`,
        { userID },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, 
          },
        }
      );
  
      fetchCartItems(); 
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
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
            <div className=" mt-4 text-black">
              <h2 className="text-center mb-0" >Your Cart</h2>
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
                      onRemoveItem={handleRemoveItem}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-lg">
            <div className="mt-4  text-black">
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
              <div className="card-footer text-center">
              <button className="btn btn-secondary w-100 mb-2 mt-2" style={{backgroundColor:"green"}}>Proceed to Checkout</button>
              <button className="btn btn-secondary w-100 " style={{backgroundColor:"red"}} onClick={handleClearCart}>Clear Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
