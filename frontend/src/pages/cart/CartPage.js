import React from 'react';
import { useCart } from 'pages/cart/Cart'; // Adjust path if necessary
import CartItem from '../../Components/cart/CartItem';
import CartSummary from '../../Components/cart/CartSummary';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.productPrice, 0);

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="list-group mb-4">
            {cartItems.map((item) => (
              <CartItem key={item._id} item={item} removeFromCart={removeFromCart} />
            ))}
          </ul>
          <CartSummary total={total} clearCart={clearCart} />
        </div>
      )}
    </div>
  );
};

export default CartPage;
