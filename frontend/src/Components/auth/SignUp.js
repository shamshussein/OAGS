import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './auth.css';
import { signUp, googlSignUp } from '../services/authService';
import useTogglePassword from "Components/utils/togglePassword";
import PasswordInput from "Components/utils/passwordInput";
import validator from 'validator';

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
  const {
     showPassword,
     togglePasswordVisibility,
  } = useTogglePassword();

  const {
    showPassword: showConfirmPassword,
    togglePasswordVisibility: toggleConfirmPasswordVisibility,
  } = useTogglePassword();

  const handleSignUp = async () => {
    setError('');

  if (!formData.userName.trim()) {
    setError('Username is required.');
    return;
  }
  
  if (!formData.email.trim()) {
    setError('Email is required.');
    return;
  }
  if (!validator.isEmail(formData.email)) {
    setError('Please enter a valid email address.');
    return;
  }
  
  if (!formData.phoneNumber.trim()) {
    setError('Phone number is required.');
    return;
  }

  const lebanesePhoneRegex = /^(?:\+961|961)?(3|70|71|76|78|79|81|01|04|05|06|07|08|09)[0-9]{6}$/;
  if (!lebanesePhoneRegex.test(formData.phoneNumber)) {
    setError('Please enter a valid Lebanese phone number.');
    return;
  }
  
  if (!formData.password) {
    setError('Password is required.');
    return;
  }
  if (!validator.isStrongPassword(formData.password)) {
    setError(
      'Provide a strong password containing at least one uppercase letter, one lowercase letter, a number, and a symbol.'
    );
    return;
  }
  
  if (formData.password !== formData.passwordConfirm) {
    setError('Passwords do not match.');
    return;
  }

    try {
      const response = await signUp(formData);
      localStorage.setItem('user', JSON.stringify({ 
        token: response.data.token, 
        userName: response.data.data.user.userName,
        userID :response.data.data.user._id,
        phoneNumber :response.data.data.user.phoneNumber,
        isGoogleSignIn: false,
      }));
      setError('');
      navigate('/'); 

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
              userName: name,
              phoneNumber: phoneNumber,
              email: email,
              userID: serverResponse.data.data.user._id,
              profilePicture: serverResponse.data.data.user.profilePicture,
              isGoogleSignIn: true,
          })
      );
        navigate('/');

    } catch (err) {
        setError(err.response?.data?.message || "Google sign-up failed.");
    }
};

const handleGoogleFailure = (error) => {
    console.error("Google Sign-In Error:", error);
    setError("Google sign-in failed. Please try again.");
};
  
const handlePrivacyPolicyClick = () => {
  window.open('/privacy_policy.html', '_blank');
};
const handleTermsOfUseClick = () => {
  window.open('/terms_of_use.html', '_blank');
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
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordConfirm" className="form-label">
              Confirm Password
            </label>
            <PasswordInput
              id="passwordConfirm"
              placeholder="Confirm your password"
              value={formData.passwordConfirm}
              onChange={(e) =>
                setFormData({ ...formData, passwordConfirm: e.target.value })
              }
              showPassword={showConfirmPassword}
              togglePasswordVisibility={toggleConfirmPasswordVisibility}
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}
          <button
            type="button"
            className="btn btn-secondary w-100 mb-3"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
          <p className="text-center mb-4">Or</p>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            useOneTap
            className="w-100 mt-3"
          />
        </form>
        <p className="terms text-center mt-4">
          By creating an account, you agree to the{' '}
          <span
              style={{ color: '#007bff', cursor: 'pointer' }}
              onClick={handleTermsOfUseClick}
            >
              Terms Of Use
            </span> and acknowledge the{' '}
          <span
              style={{ color: '#007bff', cursor: 'pointer' }}
              onClick={handlePrivacyPolicyClick}
            >
              Privacy Policy
            </span>.
        </p>
      </div>
    </div>
    </GoogleOAuthProvider>
  );
};

export default SignUp;
