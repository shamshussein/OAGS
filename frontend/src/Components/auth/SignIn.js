import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import './auth.css';
import { signIn, googlSignUp } from '../services/authService';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); 

  const handleSignIn = async () => {
    try {
      const response = await signIn({ email , password });
      localStorage.setItem('user', JSON.stringify({ 
        token: response.data.token, 
        userName: response.data.data.user.userName,
        userID :response.data.data.user._id,
        phoneNumber :response.data.data.user.phoneNumber

      }));
      setSuccess('Sign-in successful!');
      navigate('/'); 
      console.log(response.data.token);
      console.log("resp",response)
      console.log("user",response.data.data.user)

    } catch (err) {
      setError(err.response?.data?.message || 'Wrong credentials');
    }
  };

  const handleCreateAccountClick = () => {
      navigate('/signup'); 
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
            })
        );

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
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
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
        <p className="text-center mb-4">Or</p>

          <button
            type="button"
            className="btn btn-outline-dark w-100 mb-3"
            onClick={handleCreateAccountClick}>
            Create an Account
        </button>
        </form>
        <p className="terms text-center mt-4">
          By signing in or creating a member account, you agree to the{' '}
          <Link to="/terms">Terms of Use</Link> and acknowledge the{' '}
          <Link to="/privacy-policy">Privacy Policy</Link>.
        </p>
      </div>
    </div>
        </GoogleOAuthProvider>
  
  );
};

export default SignIn;
