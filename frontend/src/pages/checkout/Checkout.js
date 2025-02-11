import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CheckoutItems from "Components/Checkout/CheckoutItem";
import "styles/Checkout.css";
import API_BASE_URL from "config";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("user"));

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [shippingDetails, setShippingDetails] = useState({
        name: userData?.userName || "",
        number: "",
        email: userData?.email || "",
        address: "",
        paymentMethod: "",
    });

    const [orderStatus, setOrderStatus] = useState(null);
    const [phoneError, setPhoneError] = useState("");

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/carts/getCartItems`, {
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
                `${API_BASE_URL}/api/checkout`,
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
    

    if (loading) return <p>Loading cart...</p>;
    if (error) return <p className="error-message">{error}</p>;

    const discount = totalPrice * 0.1;
    const deliveryFee = cartItems.length > 0 ? 5.99 : 0;
    const finalTotal = totalPrice - discount + deliveryFee;
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="checkout-container">
            <div className="shipping-info">
                <h4 className="section-title">Shipping Information</h4>
                <form onSubmit={handleSubmit}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={shippingDetails.name}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                        required
                    />

                    <label>Phone Number</label>
                    <input
                        type="text"
                        value={shippingDetails.number}
                        onChange={handlePhoneChange}
                        required
                        placeholder="Enter your phone number"
                    />
                    {phoneError && <p className="error-message">{phoneError}</p>}

                    <label>Address</label>
                    <input
                        type="text"
                        value={shippingDetails.address}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                        required
                        placeholder="Enter your address"

                    />
                    <label>City</label>
                    <input
                        type="text"
                        value={shippingDetails.city}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                        required
                        placeholder="Enter your city"

                    />

                    <label>Postal Code</label>
                    <input
                        type="text"
                        value={shippingDetails.postalCode}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })}
                        required
                        placeholder="Enter your postal code"

                    />

                    <label>Email</label>
                    <input type="email" value={shippingDetails.email} disabled />

                    <label>Payment Method</label>
                    <select
                        value={shippingDetails.paymentMethod}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, paymentMethod: e.target.value })}
                        required
                    >
                        <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>

                    <button type="submit" className="checkout-button">Complete Checkout</button>
                </form>
            </div>

            <div className="right-side">
                <CheckoutItems cart={cartItems} />
                <p>Total Quantity: <strong>{totalQuantity}</strong></p>
                <p>Total Price: <strong>${totalPrice.toFixed(2)}</strong></p>
                <p>Discount: <strong>${discount.toFixed(2)}</strong></p>
                <p>Delivery Fee: <strong>${deliveryFee.toFixed(2)}</strong></p>
                <p className="final-total">Final Total: <strong>${finalTotal.toFixed(2)}</strong></p>
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
