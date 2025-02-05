import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash, faUserCircle, faKey, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./EditProfile.css"; // Custom CSS for additional styling

function EditProfile() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
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

  const handleRemovePicture = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/users/removeProfilePicture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Profile picture removed successfully!");
        setError("");

        const updatedUser = { ...userData };
        updatedUser.profilePicture = null;
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove profile picture");
      setSuccess("");
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };  

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/users/deleteUser`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
  
        if (response.status === 200) {
          localStorage.removeItem("user");
          alert("Your account has been deleted successfully.");
          navigate("/");
          window.location.reload();
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete account");
      }
    }
  };
  
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.removeItem("user");
      alert("You have successfully logged out.");
      navigate("/");
      window.location.reload();
    }
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header text-white">
              <h2 className="card-title mb-0">
                <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                Edit Profile
              </h2>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-4 text-center">
                  {userData.profilePicture ? (
                    <img
                      src={userData.profilePicture}
                      alt="Profile"
                      className="img-thumbnail rounded-circle mb-3"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="text-muted">
                      <FontAwesomeIcon icon={faUserCircle} size="6x" />
                      <p className="mt-2">No profile picture uploaded.</p>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="profilePicture" className="form-label fw-bold">
                    Upload New Profile Picture
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="profilePicture"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                  />
                </div>

                <div className="d-flex gap-3 justify-content-end mb-4">
                  <button type="submit" className="btn btn-secondary">
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Save Changes
                  </button>
                  {userData.profilePicture && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleRemovePicture}
                    >
                      <FontAwesomeIcon icon={faTrash} className="me-2" />
                      Remove Profile Picture
                    </button>
                  )}
                </div>

                <div className="border-top pt-3">
                  {!userData.isGoogleSignIn && (
                    <button
                    type="button"
                      className="btn btn-outline-secondary w-100 mb-3"
                      onClick={handleChangePassword}
                    >
                      <FontAwesomeIcon icon={faKey} className="me-2" />
                      Change Password
                    </button>
                  )}
                  <button
                    className="btn btn-outline-danger w-100 mb-3"
                    onClick={handleDeleteAccount}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Delete Account
                  </button>
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Logout
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;