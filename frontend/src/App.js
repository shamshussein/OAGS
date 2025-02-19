import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from 'Components/Layout/MainLayout';
import AuthLayout from 'Components/Layout/AuthLayout';
import Hero from 'pages/home/Hero';
import Product from 'pages/product/Product';
import SignIn from 'Components/Auth/SignIn';
import Cart from 'pages/cart/Cart'; 
import SignUp from 'Components/Auth/SignUp';
import ContactUs from 'pages/contact/ContactUs';
import AboutUs from 'pages/about/AboutUs';
import EditProfile from 'Components/Layout/NavBar/EditProfile';
import Checkout from 'pages/checkout/Checkout';
import Orders from 'pages/order/Orders';
import ChangePassword from 'Components/Layout/NavBar/ChangePassword';
import ForgotPassword from 'Components/Auth/ForgotPassword';
import ResetPassword from 'Components/Auth/ResetPassword';

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
          path="/checkout"
          element={
            <MainLayout>
              <Checkout />
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
            <Orders />
          </MainLayout>
        }
      />
       <Route
        path="/edit-profile"
        element={
          <MainLayout>
           <EditProfile />
          </MainLayout>
        }
      />
 <Route
        path="/change-password"
        element={
          <MainLayout>
           <ChangePassword />
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
        path="/forgot-password"
        element={
          <AuthLayout>
           <ForgotPassword/>
          </AuthLayout>
        }
      />
      <Route
        path="/reset-password"
        element={
          <AuthLayout>
           <ResetPassword/>
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
