import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate  } from 'react-router-dom';
import './header.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (confirmed) {
      localStorage.removeItem("token");
      setIsLoggedIn(false); 
      alert("You have successfully logged out.");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom border-black">
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
              <Link className="nav-link text-black fw-bold" to="/">Home</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link text-black fw-bold" to="/about-us">About Us</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link text-black fw-bold" to="/products">Products</Link>
            </li>
            <li className="nav-item me-3">
              <Link className="nav-link text-black fw-bold" to="/contact">Contact</Link>
            </li>
            {
            isLoggedIn ? (<li className="nav-item">
              <Link className="nav-link text-black fw-bold" to="/orders">My Orders</Link>
            </li>):
           ( <li></li>)
            }
          </ul>

          <div className="d-flex align-items-center">
            <Link to="/cart" className="btn position-relative me-3">
              <FontAwesomeIcon icon={faCartShopping} className="fs-5 headerIcons" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                <span className="cart-indicator">0</span>
              </span>
            </Link>
            {isLoggedIn ? (
        <button
          id="logoutIcon"
          className="btn"
          onClick={handleLogout}
        >
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className="fs-5 headerIcons"
          />
        </button>
      ) : (
        <Link to="/signin" className="btn me-3">
          <FontAwesomeIcon
            icon={faUser}
            className="fs-5 headerIcons"
          />
        </Link>
      )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
