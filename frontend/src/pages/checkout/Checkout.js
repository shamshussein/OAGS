import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import CheckoutItems from "Components/checkout/CheckoutItem";
import "styles/Checkout.css"; // Import external CSS

const CheckoutPage = () => {
    const location = useLocation();
    const { cartItems, totalPrice } = location.state || { cartItems: [], totalPrice: 0 }; 

    const [shippingDetails, setShippingDetails] = useState({
        name: "",
        number: "",
        email: "",
        address: "",
        paymentMethod: "",
    });

    const [orderStatus, setOrderStatus] = useState(null);
    const [phoneError, setPhoneError] = useState(""); // State to handle phone number validation errors

    // Lebanese Phone Number Validation
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
            setPhoneError(""); // Clear error message if valid
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if the phone number is valid before submitting
        if (!validatePhoneNumber(shippingDetails.number)) {
            setPhoneError("Please enter a valid Lebanese phone number.");
            return; // Prevent form submission
        }

        try {
            const response = await axios.post("http://localhost:5000/api/checkout", {
                cart: cartItems,
                shippingDetails,
            });

            setOrderStatus(response.data);
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    const discount = totalPrice * 0.1;
    const deliveryFee = cartItems.length > 0 ? 5.99 : 0;
    const finalTotal = totalPrice - discount + deliveryFee;
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="checkout-container">
            <CheckoutItems cart={cartItems} />

            <div className="order-summary">
                <h2>Order Summary</h2>
                <p>Total Quantity: <strong>{totalQuantity}</strong></p>
                <p>Total Price: <strong>${totalPrice.toFixed(2)}</strong></p>
                <p>Discount: <strong>${discount.toFixed(2)}</strong></p>
                <p>Delivery Fee: <strong>${deliveryFee.toFixed(2)}</strong></p>
                <p className="final-total">Final Total: <strong>${finalTotal.toFixed(2)}</strong></p>
            </div>

            <div className="shipping-info">
                <h3>Shipping Information</h3>
                <form onSubmit={handleSubmit}>

                    <label>Full Name:</label>
                    <input
                        type="text"
                        value={shippingDetails.name}
                        onChange={e => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                        required
                    />

                    <label>Phone Number:</label>
                    <input
                        type="text"
                        value={shippingDetails.number}
                        onChange={handlePhoneChange}
                        required
                    />
                    {phoneError && <p className="error-message">{phoneError}</p>} {/* Display error if invalid */}

                    <label>Address:</label>
                    <input
                        type="text"
                        value={shippingDetails.address}
                        onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                        required
                    />

                    <label>E-mail:</label>
                    <input
                        type="email"
                        value={shippingDetails.email}
                        onChange={e => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                        required
                    />

                    <label>Payment Method:</label>
                    <select
                        value={shippingDetails.paymentMethod}
                        onChange={e => setShippingDetails({ ...shippingDetails, paymentMethod: e.target.value })}
                        required
                    >
                        <option value="">Select Payment Method</option>
                        <option value="Visa Card">Visa Card</option>
                        <option value="OMT">OMT</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>

                    <button type="submit" className="checkout-button">
                        Complete Checkout
                    </button>
                </form>
            </div>

            {orderStatus && (
                <div className="order-status">
                    <h3>{orderStatus.message}</h3>
                    <p>Order ID: {orderStatus.orderId}</p>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
