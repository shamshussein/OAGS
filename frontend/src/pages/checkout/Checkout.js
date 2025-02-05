import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import CheckoutItems from "Components/checkout/CheckoutItem";
import "styles/Checkout.css";

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
    const [phoneError, setPhoneError] = useState(""); 

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

    const handlePaymentDetailsChange = (e) => {
        const { name, value } = e.target;
    
        // Validate Card Number (16-digit numeric)
        if (name === "cardNumber" && (!/^\d{0,16}$/.test(value))) {
            return; // Prevent invalid input
        }
    
        // Validate CVV (3-4 digit numeric)
        if (name === "cvv" && (!/^\d{0,4}$/.test(value))) {
            return; // Prevent invalid input
        }
    
        // Update state
        setShippingDetails({ ...shippingDetails, [name]: value });
    };
    
    const handleExpiryDateChange = (e) => {
        let value = e.target.value;
    
        // Format as MM/YY while typing
        value = value.replace(/\D/g, ""); // Remove non-numeric
        if (value.length > 2) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4);
        }
    
        setShippingDetails({ ...shippingDetails, expiryDate: value });
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("test");
        if (!validatePhoneNumber(shippingDetails.number)) {
            setPhoneError("Please enter a valid Lebanese phone number.");
            return; 
            
        }

        try {
            // Retrieve the JSON string from local storage
            const userString = localStorage.getItem("user");

// Parse the JSON string to an object
            const userObject = JSON.parse(userString);

// Extract  the token
            const token = userObject.token;

            console.log(token);
            const response = await axios.post("http://localhost:3000/api/checkout",{
                cart: cartItems,
                shippingDetails,
            },{headers:{Authorization:`Bearer ${token}`}});

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
   
    <div className="shipping-info">
        <h4 style={{textAlign:'center',marginBottom:'5vh',marginTop:'4vh',fontSize:'1.5em'}}>Shipping Information</h4>
        <form onSubmit={handleSubmit}>

            <label style={{fontSize:'1em'}}>Full Name</label>
            <input
                type="text"
                value={shippingDetails.name}
                onChange={e => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                required
                placeholder="Enter your full name"
            />

            <label style={{fontSize:'1em'}}>Phone Number</label>
            <input
                type="text"
                value={shippingDetails.number}
                onChange={handlePhoneChange}
                required
                placeholder="Enter your phone number"
            />
            {phoneError && <p className="error-message">{phoneError}</p>} 

            <label style={{fontSize:'1em'}}>Address</label>
            <input
                type="text"
                value={shippingDetails.address}
                onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                required
                placeholder="Enter your address"
            />

            <label style={{fontSize:'1em'}}>E-mail</label>
            <input
                type="email"
                value={shippingDetails.email}
                onChange={e => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                required
                placeholder="Enter your email"
            />

            <label style={{fontSize:'1em'}}>Payment Method</label>
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

            {/* Conditional Fields for Visa/OMT */}
            {(shippingDetails.paymentMethod === 'Visa Card' || shippingDetails.paymentMethod === 'OMT') && (
                <>
                    <label style={{fontSize:'1em'}}>Card Number</label>
                    <input
                        type="text"
                        name="cardNumber"
                        value={shippingDetails.cardNumber}
                        onChange={handlePaymentDetailsChange}
                        required
                        placeholder="1234 5678 9012 3456"
                    />
                    {shippingDetails.cardNumber && shippingDetails.cardNumber.length !== 16 && (
                        <p className="error-message">Card number must be 16 digits</p>
                    )}

                    <label style={{fontSize:'1em'}}>Expiry Date</label>
                    <input
                        type="text"
                        name="expiryDate"
                        value={shippingDetails.expiryDate}
                        onChange={handleExpiryDateChange}
                        required
                        placeholder="MM/YY"
                    />

                    <label style={{fontSize:'1em'}}>CVV</label>
                    <input
                        type="text"
                        name="cvv"
                        value={shippingDetails.cvv}
                        onChange={handlePaymentDetailsChange}
                        required
                        placeholder="123"
                    />
                    {shippingDetails.cvv && (shippingDetails.cvv.length < 3 || shippingDetails.cvv.length > 4) && (
                        <p className="error-message">CVV must be 3 or 4 digits</p>
                    )}
                </>
            )}


            <button type="submit" className="checkout-button" style={{fontWeight:'bold'}} onClick={handleSubmit}>
                Complete Checkout
            </button>
        </form>
    </div>

    <div className="right-side">
        <div className="checkout-items">
            <CheckoutItems cart={cartItems} />

               
                <p>Total Quantity: <strong>{totalQuantity}</strong></p>
                <p>Total Price: <strong>${totalPrice.toFixed(2)}</strong></p>
                <p>Discount: <strong>${discount.toFixed(2)}</strong></p>
                <p>Delivery Fee: <strong>${deliveryFee.toFixed(2)}</strong></p>
                <p className="final-total">Final Total: <strong>${finalTotal.toFixed(2)}</strong></p>
            
        </div>
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