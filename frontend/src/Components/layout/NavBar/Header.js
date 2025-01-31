import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from "axios";
import './header.css';

function Header() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData && userData.token) {
      const name = userData.userName?.trim() || "U";
      setUserName(name);
      setIsLoggedIn(true);
      fetchCartItems(userData.userID);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchCartItems = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/carts/getCartItems?userId=${userId}`
      );
      setCartItems(response.data.cartItems || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      alert("You have successfully logged out.");
      window.location.reload();
      navigate("/");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (confirmed) {
      try {
        const token = userData.token;
        const response = await axios.delete(
          `http://localhost:3000/api/users/deleteUser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        window.location.reload();

        if (response.status === 200) {
          localStorage.removeItem("user");
          setIsLoggedIn(false);
          alert("Your account has been deleted successfully.");
          navigate("/");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/assets/images/logo.png" alt="Logo" style={{ height: '40px' }} />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse ms-lg-5" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item me-3">
              <NavLink
                className="nav-link text-black fw-bold"
                to="/"
                style={({ isActive }) => ({
                  textDecoration: isActive ? "underline" : "none",
                  color: isActive ? "#007bff" : "black"
                })}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item me-3">
              <NavLink
                className="nav-link text-black fw-bold"
                to="/about"
                style={({ isActive }) => ({
                  textDecoration: isActive ? "underline" : "none",
                  color: isActive ? "#007bff" : "black"
                })}
              >
                About Us
              </NavLink>
            </li>
            <li className="nav-item me-3">
              <NavLink
                className="nav-link text-black fw-bold"
                to="/products"
                style={({ isActive }) => ({
                  textDecoration: isActive ? "underline" : "none",
                  color: isActive ? "#007bff" : "black"
                })}
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item me-3">
              <NavLink
                className="nav-link text-black fw-bold"
                to="/contact"
                style={({ isActive }) => ({
                  textDecoration: isActive ? "underline" : "none",
                  color: isActive ? "#007bff" : "black"
                })}
              >
                Contact
              </NavLink>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <NavLink
                  className="nav-link text-black fw-bold"
                  to="/orders"
                  style={({ isActive }) => ({
                    textDecoration: isActive ? "underline" : "none",
                    color: isActive ? "#007bff" : "black"
                  })}
                >
                  My Orders
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center">
            <Link to="/cart" className="btn position-relative me-3">
              <FontAwesomeIcon icon={faCartShopping} className="fs-5 headerIcons" />
              {cartItems.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItems.length}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1.5px solid rgba(132, 185, 182, 0.81)",
                    borderRadius: "50%",
                    width: "45px",
                    height: "45px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "300",
                    textTransform: "uppercase",
                    backgroundImage: userData.profilePicture
                      ? `url(http://localhost:3000/uploads/${encodeURIComponent(userData.profilePicture)})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center", 
                    marginBottom: "8px",
                    marginLeft: "20px"
                  }}
                >
                  {
                  // !userData.profilePicture &&
                   userName.charAt(0)}
                </button>
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/edit-profile")}
                    >
                      Edit Profile
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/change-password")}
                    >
                      Change Password
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleDeleteAccount}>
                      Delete Account
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/signin" className="btn me-3">
                <FontAwesomeIcon icon={faUser} className="fs-5 headerIcons" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
