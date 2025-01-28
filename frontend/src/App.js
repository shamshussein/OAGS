import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from 'Components/layout/MainLayout';
import AuthLayout from 'Components/layout/AuthLayout';
import Hero from 'pages/home/Hero';
import Product from 'pages/product/Product';
import SignIn from 'Components/auth/SignIn';
import Cart from 'pages/cart/Cart'; 
import SignUp from 'Components/auth/SignUp';
import ContactUs from 'pages/contact/ContactUs';
import AboutUs from 'pages/about/AboutUs';

function App() {
  return (
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
              <Cart />
            </MainLayout>
          }
        />

      <Route
        path="/about"
        element={
          <MainLayout>
            <AboutUs />
          </MainLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <MainLayout>
            <ContactUs />
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
     <Route 
        path="/signup" 
        element={
        <AuthLayout>
          <SignUp />
          </AuthLayout>
       }
        />

    </Routes>
  );
}

export default App;
