import React from 'react';

const CartItem = ({ item }) => {
  return (
    <li>
      {item.itemType === 'product' ? item.itemId.productName : item.itemId.bundleName} - Quantity: {item.quantity}
    </li>
  );
};

export default CartItem;
