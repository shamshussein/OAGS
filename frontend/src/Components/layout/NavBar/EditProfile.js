import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    if (username) formData.append("username", username);
    if (profilePicture) formData.append("profilePicture", profilePicture);
  
    try {
      const response = await axios.put(
        `http://localhost:3000/api/users/updateProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        setSuccess("Profile updated successfully!");
        setError("");
  
        const updatedUser = { ...userData };
        if (username) updatedUser.userName = username;
        if (response.data.user.profilePicture) {
          updatedUser.profilePicture = response.data.user.profilePicture;
        }
        localStorage.setItem("user", JSON.stringify(updatedUser));
  
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      setSuccess("");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="profilePicture" className="form-label">
            Profile Picture
          </label>
          <input
            type="file"
            className="form-control"
            id="profilePicture"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-secondary">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;