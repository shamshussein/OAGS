import React from 'react'
import './footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer className="footer">
    <div className="footer-content">
   
    </div>

    <div className="social-media">
      <a href="https://www.facebook.com/youraccount" target="_blank"  rel="noopener noreferrer"className="social-icon"><FontAwesomeIcon icon={faFacebookF} /></a>
      <a href="https://www.instagram.com/youraccount" target="_blank" rel="noopener noreferrer" className="social-icon"><FontAwesomeIcon icon={faInstagram} /></a>
      <a href="https://www.whatsapp.com/youraccount" target="_blank" rel="noopener noreferrer" className="social-icon"><FontAwesomeIcon icon={faWhatsapp} /></a>
    </div>

     <div className="footer-menu">
        <ul>
          <li><a href="/">Home</a></li>
          <li>|</li>
          <li><a href="about_us_screen/about_us.html">About Us</a></li>
          <li>|</li>
          <li><a href="contact_us_screen/contact_us.html">Contact</a></li>

        </ul>
      </div>

    <div className="footer-bottom">
      <p>&copy; 2024 Outdoor Adventure Gear Store | All rights reserved.</p>
    </div>
  </footer>
  )
}

export default Footer;
