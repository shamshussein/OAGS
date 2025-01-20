import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';
import { signIn } from '../services/authService';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); 

  const handleSignIn = async () => {
    try {
      const response = await signIn({ email, password });
      localStorage.setItem('token', response.data.token);
      setSuccess('Sign-in successful!');
      navigate('/'); 

      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Wrong credentials');
    }
  };


  const handleCreateAccountClick = () => {
      navigate('/signup'); 
  };
  // const handleGoogleSignIn = async () => {
  //   try {
  //     const response = await signInWithGoogle();
  //     console.log('Google Sign-in successful:', response.data);
  //     setError('');
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'An error occurred during Google Sign-In');
  //   }
  // };

  return (
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
            className="btn btn-primary w-100 mb-3"
            onClick={handleSignIn}
          >
            Sign In
          </button>
          {/* <button
            type="button"
            className="btn btn-outline-dark w-100 mb-3"
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </button> */}
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
  );
};

export default SignIn;
