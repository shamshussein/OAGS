import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CartItem from 'Components/cart/CartItem';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
          console.error('User is not logged in.');
          return;
        }
    
        const response = await axios.get(
          `http://localhost:3000/api/carts/getCartItems?userId=${user.userID}`
        );
    
        setCartItems(response.data.cartItems);
        setTotalPrice(response.data.totalPrice);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };    

    fetchCartItems();
  }, []);

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item, index) => (
              <CartItem key={index} item={item} />
            ))}
          </ul>
          <h3>Total Price: ${totalPrice}</h3>
        </div>
      )}
    </div>
  );
};

export default Cart;
