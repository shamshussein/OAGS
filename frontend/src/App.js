import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from 'Components/layout/MainLayout';
import AuthLayout from 'Components/layout/AuthLayout';
import Hero from 'pages/home/Hero';
import Product from 'pages/product/Product';
import SignIn from 'Components/auth/SignIn';
import CartPage from 'pages/cart/CartPage'; 
import { CartProvider } from 'pages/cart/Cart'; 
import SignUp from 'Components/auth/SignUp';


function App() {
  return (
    <CartProvider>
    <Routes>
      {/* Routes with MainLayout */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Hero />
          </MainLayout>
        }
      />
      
      <Route
        path="/products"
        element={
          <MainLayout>
            <Product />
          </MainLayout>
        }
      />

      <Route
          path="/cart"
          element={
            <MainLayout>
              <CartPage />
            </MainLayout>
          }
        />

      <Route
        path="/about-us"
        element={
          <MainLayout>
            <div>About Us</div>
          </MainLayout>
        }
      />
      <Route
        path="/contact-us"
        element={
          <MainLayout>
            <div>Contact Us</div>
          </MainLayout>
        }
      />
      <Route
        path="/orders"
        element={
          <MainLayout>
            <div>My Orders</div>
          </MainLayout>
        }
      />

      {/* Routes with AuthLayout */}
      <Route
        path="/signin"
        element={
          <AuthLayout>
            <SignIn />
          </AuthLayout>
        }
      />
     <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />

    </Routes>
    </CartProvider>
  );
}

export default App;
