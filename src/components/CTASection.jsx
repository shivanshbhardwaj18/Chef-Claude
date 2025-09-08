import React from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import './CTASection.css';

export default function CTASection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCTAClick = () => {
    if (user) {
      navigate('/saved-recipes');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <div className="cta-text">
            <h2 className="cta-heading">
              Unlock Your<br />
              Culinary Potential
            </h2>
            <p className="cta-description">
              Save your AI-generated masterpieces, organize your favorite dishes, and build your personal cookbook. All at your fingertips.
            </p>
            <button 
              className="cta-button"
              onClick={handleCTAClick}
            >
              {user ? 'View Your Cookbook' : 'Start Your Cookbook Now'}
            </button>
          </div>
          
          <div className="cta-image">
            <img 
              src="/cookbook.png" 
              alt="Hand holding tablet with recipe app and cookbook"
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}