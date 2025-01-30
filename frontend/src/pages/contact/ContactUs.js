import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/ContactUs.css';
import { Whatsapp } from "react-bootstrap-icons";
import { Telephone } from "react-bootstrap-icons";


function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form data submitted:', formData);
  };

  return (
    <div className="contact-page container py-5">
      <main className="contact-container bg-light p-5 rounded shadow">
        <h1 className="text-center mb-4">Contact Us</h1>
        <p className="text-center text-muted mb-4">
          We'd love to hear from you! Please reach out with any questions or feedback.
        </p>

        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              id="message"
              name="message"
              className="form-control"
              rows="5"
              placeholder="Type your message here"
              value={formData.message}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn w-100">Send Via Email</button>
        </form>

        <div className="contact-methods mt-5 text-center">
          <h3 className="mb-3">Reach Us</h3>
          <p className="text-muted mb-4">
            For a faster response, feel free to reach us through one of the following methods:
          </p>
          <ul className="list-unstyled">
            <li className="mb-2">
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none "
              >
                <Whatsapp color='green' className='me-2' />WhatsApp
              </a>
            </li>
            <li>
              <a href="tel:+1234567890" className="text-decoration-none " style={{color: "blue" }}>
                <Telephone color='blue' className='me-2' />Call Us
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default ContactUs;
