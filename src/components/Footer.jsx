import { Link } from 'react-router-dom';
import React from 'react';
import './Footer.css';
import { useInView } from 'react-intersection-observer';

const Footer = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <footer ref={ref} className={`footer-wrapper ${inView ? 'is-visible' : ''}`}>
      <div className="footer-container">
        <div className="footer-section about-us">
          <h3 className="footer-title">Chef Claude</h3>
          <p>Your AI-powered culinary assistant. Discover, create, and share amazing recipes tailored just for you.</p>
        </div>

        <div className="footer-section quick-links">
          <h3 className="footer-title">Quick Links</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-section newsletter">
          <h3 className="footer-title">Join Our Newsletter</h3>
          <p>Get the latest recipes and cooking tips delivered to your inbox.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button type="submit">Subscribe</button>
          </form>
        </div>

        <div className="footer-section social-media">
          <h3 className="footer-title">Follow Us</h3>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Pinterest">PI</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Chef Claude. All Rights Reserved.</p>
        <div className="legal-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <span>|</span>
          <a href="/terms-of-service">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;