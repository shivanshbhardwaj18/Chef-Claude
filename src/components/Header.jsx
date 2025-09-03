// src/components/Header.jsx

import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import "./Header.css";

export default function Header() {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setShowMobileMenu(false);
    }
  }, [isMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  async function handleLogout() {
    try {
      await signOut(auth);
      setShowDropdown(false);
      setShowMobileMenu(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function toggleDropdown() {
    setShowDropdown((prev) => !prev);
  }

  function toggleMobileMenu() {
    setShowMobileMenu((prev) => !prev);
  }

  function closeMobileMenu() {
    setShowMobileMenu(false);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowDropdown(false);
      }
      if (showMobileMenu && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-button')) {
        setShowMobileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown, showMobileMenu]);

  // Get first letter of email for inside avatar
  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <>
      <header className="Header">
        {/* Logo and Name on the left */}
        <div className="header-left">
          <Link to="/" className="header-link">
            <img className="Headerimg" src="./chef-icon.png" alt="Chef Icon" />
            <h1 className="HeaderText">Chef Claude</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="log-sign">
          {user ? (
            <>
              <Link to="/contact" className="contact-button">
                Contact
              </Link>
              <div className="profile-dropdown-container">
                <button onClick={toggleDropdown} className="avatar-button">
                  <div className="avatar-gradient"></div>
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    {/* Dropdown Header - stacked layout */}
                    <div className="dropdown-header">
                      <div className="dropdown-avatar-inner">{userInitial}</div>
                      <div className="dropdown-user-info">
                        <span className="dropdown-name">
                          {user.displayName || "User"}
                        </span>
                        <span className="dropdown-email">{user.email}</span>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Account Settings
                    </Link>

                    <Link
                      to="/profile#saved-recipes"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Saved Recipes
                    </Link>

                    <div className="dropdown-divider"></div>

                    <button onClick={handleLogout} className="dropdown-logout">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="login-button">
                Log in
              </Link>
              <Link to="/signup" className="signup-button">
                Sign up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          className={`hamburger-button ${showMobileMenu ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${showMobileMenu ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          {user ? (
            <>
              {/* Centered buttons at top for logged-in users */}
              <div className="mobile-menu-buttons">
                <Link 
                  to="/contact" 
                  className="mobile-contact-button"
                  onClick={closeMobileMenu}
                >
                  Contact
                </Link>
                <button onClick={handleLogout} className="mobile-logout-button">
                  Logout
                </button>
              </div>

              {/* Mobile User Section - LEFT ALIGNED */}
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <span className="mobile-user-email">{user.email}</span>
                </div>
                <div className="mobile-avatar">{userInitial}</div>
              </div>

              {/* Mobile Menu Items - LEFT ALIGNED */}
              <Link 
                to="/profile" 
                className="mobile-menu-item"
                onClick={closeMobileMenu}
              >
                Account Settings
              </Link>

              <Link 
                to="/profile#saved-recipes" 
                className="mobile-menu-item"
                onClick={closeMobileMenu}
              >
                Saved Recipes
              </Link>
            </>
          ) : (
            <>
              {/* Mobile Menu Items for Non-Authenticated Users - CENTERED */}
              <div className="mobile-menu-buttons">
                <Link 
                  to="/login" 
                  className="mobile-login-button"
                  onClick={closeMobileMenu}
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="mobile-signup-button"
                  onClick={closeMobileMenu}
                >
                  Sign up
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}