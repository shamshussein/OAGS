import React from 'react'
import './footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

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
          <li>
          <Link to="/">Home</Link>
          </li>
          <li>|</li>
          <li>
              <Link to="/about">About Us</Link>
          </li>
          <li>|</li>
          <li>
              <Link to="/contact">Contact</Link>
          </li>

        </ul>
      </div>

    <div className="footer-bottom">
      <p>&copy; 2024 Outdoor Adventure Gear Store | All rights reserved.</p>
    </div>
  </footer>
  )
}

export default Footer;
