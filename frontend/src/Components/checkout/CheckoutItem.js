import React from "react";

const CheckoutItems = ({ cart }) => {
  if (cart.length === 0) {
    return <p className="text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Checkout Items</h2>
      <ul>
        {cart.map((item) => {
          // Ensure each item has necessary properties before destructuring
          if (!item || !item.name || !item.itemPrice || !item.quantity) return null;

          const { name, itemPrice, quantity } = item;
          const discountedPrice = itemPrice * (1 - 0.1); // 10% discount

          return (
            <li key={item.productId} className="flex justify-between border-b py-2">
              <span className="font-medium">
                {name} (x{quantity})
              </span>
              <span className="text-green-600">
                ${(itemPrice ).toFixed(2)} | Discounted: ${(discountedPrice).toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>
    
    </div>
  );
};

export default CheckoutItems;
