import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/forgotPassword', { email });
            setResetToken(response.data.resetToken); // Show token on UI
        } catch (error) {
            alert('Error generating reset token');
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Get Reset Token</button>
            </form>

            {resetToken && (
                <div>
                    <p>Copy this token and use it to reset your password:</p>
                    <code>{resetToken}</code>
                </div>
            )}
            
            <button onClick={() => window.location.href = '/reset-password'}>Reset Password</button>

        </div>
        
    );
};

export default ForgotPassword;
