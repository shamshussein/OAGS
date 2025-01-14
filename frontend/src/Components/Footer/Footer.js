import React from 'react'
import './footer.css'


function Footer() {
  return (
    <footer className="footer">
    <div className="footer-content">
      <div className="contact-info">
        <h3>Contact Information</h3><br />
        <ul>
          <li><strong>Address:</strong> Hamra Street, Beirut, Lebanon</li><br />
          <li><strong>Email:</strong> info@outdooradventuregearstore.com</li><br />
          <li><strong>Phone:</strong> +71 567 888</li>
        </ul>
      </div>
      
      <div className="footer-menu">
        <h3 className='text-white'>Menu</h3>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about_us_screen/about_us.html">About Us</a></li>
          <li><a href="products_screen/products.html">Products</a></li>
          <li><a href="contact_us_screen/contact_us.html">Contact</a></li>
          <li><a href="cart_screen/cart.html">Cart</a></li>
          <li><a href="orders_history_screen/orders_history.html">My Orders</a></li>

        </ul>
      </div>
      
      <div className="account">
        <h3>Account</h3>
        <ul>
          <li><a href="authentication_screen/signin.html" id="loginfooter">Login</a></li>
          <li><a href="authentication_screen/signup.html" id="registerfooter">Register</a></li>
          <li><a href="" id="logoutfooter">Logout</a></li>

        </ul>
      </div>
    </div>

    <div className="social-media">
      <a href="https://www.facebook.com/youraccount" target="_blank" className="social-icon"><i className="fab fa-facebook-f"></i></a>
      <a href="https://www.instagram.com/youraccount" target="_blank" className="social-icon"><i className="fab fa-instagram"></i></a>
      <a href="https://www.whatsapp.com/youraccount" target="_blank" className="social-icon"><i className="fab fa-whatsapp"></i></a>
    </div>

    <div className="footer-bottom">
      <p>&copy; 2024 Outdoor Adventure Gear Store. All rights reserved.</p>
    </div>
  </footer>
  )
}

export default Footer   