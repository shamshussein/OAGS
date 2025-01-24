import React from 'react';
import { useCart } from './Cart'; // Import the useCart hook
import CartItem from './CartItem'; // Import the CartItem component
import CartSummary from './CartSummary'; // Import the CartSummary component
import './CartBody.css'; // CartBody styles

function CartBody() {
  const { cartItems, removeFromCart, clearCart } = useCart(); // Destructure cart methods

  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  return (
    <div className="cart-body">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart text-center">
          <h4>Your cart is empty.</h4>
        </div>
      ) : (
        <>
          <ul className="list-group">
            {cartItems.map((item) => (
              <CartItem key={item._id} item={item} removeFromCart={removeFromCart} />
            ))}
          </ul>
          <CartSummary total={total} clearCart={clearCart} />
        </>
      )}
    </div>
  );
}

export default CartBody;
