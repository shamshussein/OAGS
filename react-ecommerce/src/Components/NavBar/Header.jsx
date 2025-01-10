import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping , faUser} from '@fortawesome/free-solid-svg-icons';
import './header.css'

function Header() {
  return (
    <nav className="navbar navbar-expand-lg border-bottom border-black">
      <div className="container">
        <a className="navbar-brand" href="#">
          <img src="/src/assets/images/logo.png" alt="Logo"  style={{ height: '40px' }}/>
        </a>
        {/* Navbar Toggler (Burger Icon) */}
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
              <a className="nav-link text-black fw-bold " href="index.html">Home</a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link text-black fw-bold" href="about_us_screen/about_us.html">About Us</a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link text-black fw-bold" href="products_screen/products.html">Products</a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link text-black fw-bold" href="contact_us_screen/contact_us.html">Contact</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-black fw-bold" href="orders_history_screen/orders_history.html">My Orders</a>
            </li>
          </ul>
    
          <div className="d-flex align-items-center">
            <a href="cart_screen/cart.html" className="btn position-relative me-3">
            <FontAwesomeIcon icon={faCartShopping} className='fs-5 headerIcons' />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                <span className="cart-indicator">0</span>
              </span>
            </a>
            <a href="authentication_screen/signin.html" className="btn me-3">
              <FontAwesomeIcon icon={faUser} className='fs-5 headerIcons'/>
            </a>
            <a href="#" id="logoutIcon" className="btn">
              <i className="bx bx-log-out"></i>
            </a>
          </div>
        </div>
      </div>
    </nav>
    
    
  )
}

export default Header   