import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import CheckoutItems from "Components/checkout/CheckoutItem";

const CheckoutPage = () => {
    const location = useLocation();
    const { cartItems, totalPrice } = location.state || { cartItems: [], totalPrice: 0 }; 

    const [shippingDetails, setShippingDetails] = useState({
        address: "",
        city: "",
        postalCode: "",
    });
    const [orderStatus, setOrderStatus] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

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
        <div className="container mx-auto p-6">
           
            <CheckoutItems cart={cartItems} /> 

           
            <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <p className="text-lg">Total Quantity: <strong>{totalQuantity}</strong></p>
                <p className="text-lg">Total Price: <strong>${totalPrice.toFixed(2)}</strong></p>
                <p className="text-lg">Discount: <strong>${discount.toFixed(2)}</strong></p>
                <p className="text-lg">Delivery / Taxes: <strong>${deliveryFee.toFixed(2)}</strong></p>
                <p className="text-lg">Final Total: <strong>${finalTotal.toFixed(2)}</strong></p>
            </div>

       
            <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Address:</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={shippingDetails.address}
                            onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">City:</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={shippingDetails.city}
                            onChange={e => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Postal Code:</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={shippingDetails.postalCode}
                            onChange={e => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        Complete Checkout
                    </button>
                </form>
            </div>

         
            {orderStatus && (
                <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg">
                    <h3 className="text-lg font-semibold">{orderStatus.message}</h3>
                    <p>Order ID: {orderStatus.orderId}</p>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
