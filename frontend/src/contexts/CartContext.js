// import React, { createContext, useState, useEffect, useContext } from "react";
// import axios from "axios";

// export const CartContext = createContext();

// const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);

//   const fetchCartItems = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (!user || !user.userID) {
//         console.error("User is not logged in or userID is missing.");
//         return;
//       }

//       const response = await axios.get(
//         `http://localhost:3000/api/carts/getCartItems?userId=${user.userID}`
//       );

//       setCartItems(response.data.cartItems || []);
//       setTotalPrice(response.data.totalPrice || 0);
//     } catch (error) {
//       console.error("Error fetching cart items:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCartItems();
//   }, []);

//   return (
//     <CartContext.Provider
//       value={{ cartItems, totalPrice, setCartItems, fetchCartItems }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };

// export default CartProvider;
