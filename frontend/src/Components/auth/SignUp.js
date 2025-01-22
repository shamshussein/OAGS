import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './auth.css';
import { signUp, googlSignUp } from '../services/authService';

const SignUp = () => {
  
  const [formData, setFormData] = useState({
    email: '',
    userName: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); 

  const handleSignUp = async () => {
    try {
      const response = await signUp(formData);
      localStorage.setItem('user', JSON.stringify({ 
        token: response.data.token, 
        userName: response.data.userName 
      }));
      setError('');
      navigate('/'); 
      console.log(response.data.token);
      console.log(response.data.userName);

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setSuccess('');
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
        const credential = response.credential; 

        const payload = JSON.parse(atob(credential.split('.')[1]));
        const { email, name } = payload;
        const phoneNumber = payload.phoneNumber || '08800486'; 

        const serverResponse = await googlSignUp({
            credential,
            email,
            name,
            phoneNumber,
        });

        localStorage.setItem(
            'user',
            JSON.stringify({
                token: serverResponse.data.token,
                userName: serverResponse.data.userName,
                phoneNumber: serverResponse.data.phoneNumber || '',
                email: serverResponse.data.email,
            })
        );
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loggedInEmail', email);
        localStorage.setItem('isGoogleUser', 'true');


        navigate('/');

    } catch (err) {
        console.error("Error during Google Sign-Up:", err);
        setError(err.response?.data?.message || "Google sign-up failed.");
    }
};

const handleGoogleFailure = (error) => {
    console.error("Google Sign-In Error:", error);
    setError("Google sign-in failed. Please try again.");
};
  

  return (
    <GoogleOAuthProvider clientId="228358965090-n0v3qt1ub11abq17adigr3s0u0sfgsu1.apps.googleusercontent.com">

    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="auth-container">
      <div className="logo text-center mb-4">
          <img src="/assets/images/logo.png" alt="Logo" width="100" />
        </div>
        <h1 className="text-center mb-4">Sign Up</h1>
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter your username"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              className="form-control"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordConfirm" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="passwordConfirm"
              className="form-control"
              placeholder="Confirm your password"
              value={formData.passwordConfirm}
              onChange={(e) =>
                setFormData({ ...formData, passwordConfirm: e.target.value })
              }
              required
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}
          <button
            type="button"
            className="btn btn-outline-dark w-100 mb-3"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            useOneTap
            className="w-100 mt-3"
          />
        </form>
      </div>
    </div>
    </GoogleOAuthProvider>
  );
};

export default SignUp;
