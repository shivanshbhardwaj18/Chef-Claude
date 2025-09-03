import React from 'react';
import './ContactPage.css'; 

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message!');
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-page-container">
        <header className="contact-header">
          <h1>Get in Touch</h1>
          <p>Have a question, a suggestion, or just want to say hello? We'd love to hear from you. Fill out the form below, and we'll get back to you as soon as possible.</p>
        </header>

        <div className="contact-body-grid">
          {/* --- Left Side: Contact Form --- */}
          <div className="contact-form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="6" required></textarea>
              </div>
              <button type="submit" className="submit-button">Send Message</button>
            </form>
          </div>

          {/* --- Right Side: Contact Info --- */}
          <div className="contact-info-section">
            <div className="info-block">
              <h3>Our Office</h3>
              <p>📍 123 Culinary Lane, Foodie City, 90210</p>
            </div>
            <div className="info-block">
              <h3>Email Us</h3>
              <p>✉️ hello@chefclaude.com</p>
            </div>
            <div className="info-block">
              <h3>Call Us</h3>
              <p>📞 (555) 123-4567</p>
            </div>
            <div className="info-block map-placeholder">
              <img src="https://i.imgur.com/gKj4D6k.png" alt="Map placeholder" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
