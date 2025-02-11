import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CheckoutItems from "Components/checkout/CheckoutItem";
import "styles/Checkout.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [phoneError, setPhoneError] = useState("");

  const [shippingDetails, setShippingDetails] = useState({
    name: userData?.userName || "",
    number: "",
    email: userData?.email || "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "Cash on Delivery",
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/carts/getCartItems`, {
          params: { userId: userData.userID },
        });

        if (response.data.cartItems.length === 0) {
          setError("Your cart is empty.");
        } else {
          setCartItems(response.data.cartItems);
          setTotalPrice(response.data.totalPrice);
        }
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userData]);

  const validatePhoneNumber = (number) => {
    const lebanesePhoneRegex = /^(?:\+961|961)?(3|70|71|76|78|79|81|01|04|05|06|07|08|09)[0-9]{6}$/;
    return lebanesePhoneRegex.test(number);
  };

  const handlePhoneChange = (e) => {
    const newPhoneNumber = e.target.value;
    setShippingDetails({ ...shippingDetails, number: newPhoneNumber });

    if (!validatePhoneNumber(newPhoneNumber)) {
      setPhoneError("Invalid Lebanese phone number. Example: 70-123456");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validatePhoneNumber(shippingDetails.number)) {
      setPhoneError("Please enter a valid Lebanese phone number.");
      return;
    }

    console.log("Checkout Request Data:", { cart: cartItems, shippingDetails });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/checkout",
        { cart: cartItems, shippingDetails },
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );

      setOrderStatus(response.data);
      setCartItems([]);
      setTotalPrice(0);

      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Checkout Error:", error.response?.data || error.message);
      setError("Failed to process order.");
    }
  };

  if (loading) return <p className="info-message">Loading cart...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const discount = totalPrice * 0.1;
  const deliveryFee = cartItems.length > 0 ? 5.99 : 0;
  const finalTotal = totalPrice - discount + deliveryFee;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="checkout-container">
      <div className="card shipping-info">
        <h2>Shipping Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={shippingDetails.name}
              onChange={(e) =>
                setShippingDetails({ ...shippingDetails, name: e.target.value })
              }
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="text"
              value={shippingDetails.number}
              onChange={handlePhoneChange}
              required
              placeholder="e.g., 70-123456"
            />
            {phoneError && <span className="error-text">{phoneError}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              value={shippingDetails.address}
              onChange={(e) =>
                setShippingDetails({ ...shippingDetails, address: e.target.value })
              }
              required
              placeholder="Enter your address"
            />
          </div>

          <div className="form-group inline-group">
            <div>
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={shippingDetails.city}
                onChange={(e) =>
                  setShippingDetails({ ...shippingDetails, city: e.target.value })
                }
                required
                placeholder="City"
              />
            </div>
            <div>
              <label htmlFor="postalCode">Postal Code</label>
              <input
                id="postalCode"
                type="text"
                value={shippingDetails.postalCode}
                onChange={(e) =>
                  setShippingDetails({ ...shippingDetails, postalCode: e.target.value })
                }
                required
                placeholder="Postal Code"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={shippingDetails.email} disabled />
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              value={shippingDetails.paymentMethod}
              onChange={(e) =>
                setShippingDetails({ ...shippingDetails, paymentMethod: e.target.value })
              }
              required
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          <button type="submit" className="checkout-button">
            Complete Checkout
          </button>
        </form>
      </div>

      <div className="card right-side">
        <h2>Order Summary</h2>
        <CheckoutItems cart={cartItems} />
        <div className="summary-details">
          <p>
            Total Quantity: <strong>{totalQuantity}</strong>
          </p>
          <p>
            Total Price: <strong>${totalPrice.toFixed(2)}</strong>
          </p>
          <p>
            Discount (10%): <strong>-${discount.toFixed(2)}</strong>
          </p>
          <p>
            Delivery Fee: <strong>${deliveryFee.toFixed(2)}</strong>
          </p>
          <p className="final-total">
            Final Total: <strong>${finalTotal.toFixed(2)}</strong>
          </p>
        </div>
      </div>

      {orderStatus && (
        <div className="card order-status">
          <h3>{orderStatus.message}</h3>
          <p>Order ID: {orderStatus.orderId}</p>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
