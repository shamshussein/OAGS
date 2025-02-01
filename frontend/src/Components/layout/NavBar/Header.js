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
          <button
            className="btn d-flex align-items-center profile-button"
            type="button"
            style={{
              backgroundColor: "#f8f9fa",
              border: "1.5px solid rgba(132, 185, 182, 0.81)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "300",
              textTransform: "uppercase",
              backgroundImage: userData?.profilePicture
                ? `url(${userData.profilePicture})`
                : "linear-gradient(135deg, #84b9b6, #a8d8d5)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginBottom: "5px",
              marginLeft: "20px",
              padding: 0,
              transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
            }}
            onClick={() => navigate("/edit-profile")}
            title="Edit Profile"
          >
            {!userData?.profilePicture && (
              <span
                style={{
                  fontSize: "18px",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                {userName.charAt(0)}
              </span>
            )}
          </button>
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