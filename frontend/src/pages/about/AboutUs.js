import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'styles/AboutUs.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const AboutUs = () => {
  return (
    <section id="about-us" className="container py-5">
      <div className="content-section row mt-5">
        <div className="content-card col-md-6 mb-4" id="our-story">
          <h2 className="text-black" ><i className="fas fa-mountain"></i> Our Story</h2>
          <p>Outdoor Adventure Gear Co. was born out of a love for the great outdoors and a desire to connect people with nature. From humble beginnings, we have grown into a trusted destination for adventure enthusiasts around the world.</p>
          <ul className="list-unstyled">
            <li><i className="fas fa-check-circle "></i> Founded in 2024 with passion and purpose</li>
            <li><i className="fas fa-users "></i> Over 100,000 adventurers served</li>
            <li><i className="fas fa-star"></i> Rated #1 in customer satisfaction</li>
          </ul>
        </div>

        <div className="content-card col-md-6 mb-4" id="team">
          <h2 className="text-black" ><i className="fas fa-users"></i> Meet Our Team</h2>
          <p>We are a group of outdoor enthusiasts, innovators, and dreamers committed to bringing you top-quality gear and exceptional service.</p>
          <ul className="list-unstyled">
            <li><strong>Hussein Shams:</strong> <i className="fas fa-cogs"></i> Visionary CEO and Founder</li>
            <li><strong>Hussein Kobaisy:</strong> <i className="fas fa-briefcase"></i> Operations Expert and Problem-Solver</li>
            <li><strong>Mohammad Khazaal:</strong> <i className="fas fa-laptop-code"></i> Tech Wizard and Lead Developer</li>
            <li><strong>Zahraa Sharifeh:</strong> <i className="fas fa-bullhorn"></i> Creative Marketing Guru</li>
          </ul>
        </div>
      </div>

      <div className="location-section text-center mt-5">
        <h2 className="text-black">Our Location</h2>
        <p>Visit us at our headquarters to get the latest gear and meet the team!</p>
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=35.48143565654755%2C33.895555113088065%2C35.48394620418549%2C33.89716031975024&amp;layer=mapnik&amp;marker=33.896357%2C35.482691"
          width="1000"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Our Location"
        ></iframe>
      </div>
    </section>
  );
};

export default AboutUs;
