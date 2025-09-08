import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { useState, useEffect } from "react";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth(); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 480);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (!isMobile) setShowMobileMenu(false);
  }, [isMobile]);

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showMobileMenu]);

  async function handleLogout() {
    try {
      logout(); 
      setShowDropdown(false);
      setShowMobileMenu(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function toggleDropdown() { setShowDropdown(prev => !prev); }
  function toggleMobileMenu() { setShowMobileMenu(prev => !prev); }
  function closeMobileMenu() { setShowMobileMenu(false); }

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

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <>
      <header className="Header">
        <div className="header-left">
          <Link to="/" className="header-link">
            <img className="Headerimg" src="./chef-icon.png" alt="Chef Icon" />
            <h1 className="HeaderText">Chef|Verse</h1>
          </Link>
        </div>

        <nav className="log-sign">
          {user ? (
            <>
              <Link to="/contact" className="contact-button">Contact</Link>
              <div className="profile-dropdown-container">
                <button onClick={toggleDropdown} className="avatar-button">
                  <div className="avatar-gradient"></div>
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar-inner">{userInitial}</div>
                      <div className="dropdown-user-info">
                        <span className="dropdown-name">{user.display_name || "User"}</span>
                        <span className="dropdown-email">{user.email}</span>
                      </div>
                    </div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>Account Settings</Link>
                    <Link to="/profile#saved-recipes" className="dropdown-item" onClick={() => setShowDropdown(false)}>Saved Recipes</Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-logout">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="login-button">Log in</Link>
              <Link to="/signup" className="signup-button">Sign up</Link>
            </>
          )}
        </nav>

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

      <div className={`mobile-menu ${showMobileMenu ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          {user ? (
            <>
              <div className="mobile-menu-buttons">
                <Link to="/contact" className="mobile-contact-button" onClick={closeMobileMenu}>Contact</Link>
                <button onClick={handleLogout} className="mobile-logout-button">Logout</button>
              </div>
              <div className="mobile-user-section">
                <div className="mobile-user-info"><span className="mobile-user-email">{user.email}</span></div>
                <div className="mobile-avatar">{userInitial}</div>
              </div>
              <Link to="/profile" className="mobile-menu-item" onClick={closeMobileMenu}>Account Settings</Link>
              <Link to="/profile#saved-recipes" className="mobile-menu-item" onClick={closeMobileMenu}>Saved Recipes</Link>
            </>
          ) : (
            <div className="mobile-menu-buttons">
              <Link to="/login" className="mobile-login-button" onClick={closeMobileMenu}>Log in</Link>
              <Link to="/signup" className="mobile-signup-button" onClick={closeMobileMenu}>Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
