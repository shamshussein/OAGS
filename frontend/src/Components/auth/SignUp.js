import React, { useState } from 'react';
import './auth.css';
import { signUp } from '../../services/authService';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await signUp(formData);
      console.log('Sign-up successful:', response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-container container">
      <h1>Sign Up</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
          <input
            type="password"
            id="passwordConfirm"
            className="form-control"
            placeholder="Confirm your password"
            value={formData.passwordConfirm}
            onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="button" className="btn btn-primary" onClick={handleSignUp}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
