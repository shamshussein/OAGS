import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/forgotPassword', { email });
            setResetToken(response.data.resetToken); 
        } catch (error) {
            alert('Error generating reset token');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center">Forgot Password</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Get Reset Token</button>
                            </form>

                            {resetToken && (
                                <div className="mt-4">
                                    <p>Copy this token and use it to reset your password:</p>
                                    <code className="d-block p-2 bg-light text-dark">{resetToken}</code>
                                </div>
                            )}

                            <div className="text-center mt-3">
                                <button 
                                    className="btn btn-link" 
                                    onClick={() => window.location.href = '/reset-password'}
                                >
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;