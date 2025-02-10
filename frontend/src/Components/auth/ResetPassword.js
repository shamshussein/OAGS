import React, { useState } from 'react';
import axios from 'axios';
import PasswordInput from 'Components/utils/passwordInput';
import useTogglePassword from 'Components/utils/togglePassword';
const ResetPassword = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const {
        showPassword,
        togglePasswordVisibility,
      } = useTogglePassword();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/resetPassword', { token, newPassword });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error resetting password');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center">Reset Password</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="token">Reset Token</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="token"
                                        placeholder="Enter reset token"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="newPassword">New Password</label>
                                    <PasswordInput
                                        id="newPassword"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        showPassword={showPassword}
                                        togglePasswordVisibility={togglePasswordVisibility}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Reset Password</button>
                            </form>

                            {message && (
                                <div className="mt-4 alert alert-info">
                                    <p className="mb-0">{message}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;