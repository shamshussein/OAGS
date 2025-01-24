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
        if (!user || !user.token) {
          console.error('User is not logged in.');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/carts/getCartItems', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.data.cartItems.length === 0) {
          console.log('Cart is empty.');
        }

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
