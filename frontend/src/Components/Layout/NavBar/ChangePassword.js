import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useTogglePassword from "Components/Utils/TogglePassword";
import PasswordInput from "Components/Utils/PasswordInput";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const userData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const {
    showPassword: showOldPassword,
    togglePasswordVisibility: toggleOldPasswordVisibility,
  } = useTogglePassword();

  const {
    showPassword: showNewPassword,
    togglePasswordVisibility: toggleNewPasswordVisibility,
  } = useTogglePassword();

  const {
    showPassword: showConfirmPassword,
    togglePasswordVisibility: toggleConfirmPasswordVisibility,
  } = useTogglePassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/users/changePassword`,
        { oldPassword, newPassword, confirmPassword },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );

      if (response.status === 200) {
        setMessage("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Change Password</h2>
      {message && <p className="alert alert-info">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Old Password</label>
          <PasswordInput
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            showPassword={showOldPassword}
            togglePasswordVisibility={toggleOldPasswordVisibility}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showPassword={showNewPassword}
            togglePasswordVisibility={toggleNewPasswordVisibility}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPassword={showConfirmPassword}
            togglePasswordVisibility={toggleConfirmPasswordVisibility}
          />
        </div>
        <button type="submit" className="btn btn-secondary">
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;