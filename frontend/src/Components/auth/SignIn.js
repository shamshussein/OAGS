import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './auth.css';
import { signIn, googlSignUp } from '../services/authService';
import useTogglePassword from "components/utils/togglePassword";
import PasswordInput from "components/utils/passwordInput";


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const {
    showPassword,
    togglePasswordVisibility,
  } = useTogglePassword();

  const navigate = useNavigate(); 

  const handleSignIn = async () => {
    try {
      const response = await signIn({ email , password });
      localStorage.setItem('user', JSON.stringify({ 
        token: response.data.token, 
        userName: response.data.data.user.userName,
        userID :response.data.data.user._id,
        phoneNumber :response.data.data.user.phoneNumber,
        email: response.data.data.user.email,
        profilePicture :response.data.data.user.profilePicture,
        isGoogleSignIn: false,
      }));
      setSuccess('Sign-in successful!');
      navigate('/'); 

    } catch (err) {
      setError(err.response?.data?.message || 'Wrong credentials');
    }
  };

  const handleCreateAccountClick = () => {
      navigate('/signup'); 
  };
  const handlePrivacyPolicyClick = () => {
    window.open('/privacy_policy.html', '_blank');
  };
  const handleTermsOfUseClick = () => {
    window.open('/terms_of_use.html', '_blank');
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
                userID: serverResponse.data.data.user._id,
                phoneNumber: phoneNumber,
                email: email,
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
const handleForgotPassword = () => {
  navigate("/forgot-password");
};  
  return (
   <GoogleOAuthProvider clientId="228358965090-n0v3qt1ub11abq17adigr3s0u0sfgsu1.apps.googleusercontent.com">  
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="auth-container">
        <div className="logo text-center mb-4">
          <img src="/assets/images/logo.png" alt="Logo" width="100" />
        </div>
        <h1 className="text-center mb-4">Sign In</h1>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />
          </div>
       
          <button className="mb-3" onClick={handleForgotPassword}>Forgot Password?</button>

          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          <button
            type="button"
            className="btn btn-secondary w-100 mb-3"
            onClick={handleSignIn}
          >
            Sign In
          </button>
           <GoogleLogin
                     onSuccess={handleGoogleSuccess}
                     onError={handleGoogleFailure}
                     useOneTap
                     className="w-100 mt-3"
                   />
        <p className="text-center mt-3">Or</p>
          <button
            type="button"
            className="btn btn-outline-dark w-100 mb-3"
            onClick={handleCreateAccountClick}>
            Create an Account
        </button>
        </form>
        <p className="terms text-center mt-4">
          By signing in, you agree to the{' '}
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

export default SignIn;
