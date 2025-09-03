import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import "./ProfileDropdown.css"; 

export default function ProfileDropdown() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="profile-container" ref={dropdownRef}>
      <button className="profile-icon" onClick={() => setOpen(!open)}>⋮</button>
      {open && (
        <div className="dropdown-menu">
          <p className="dropdown-email">{user.email}</p>
          <Link to="/profile" className="dropdown-link">My Profile</Link>
          <button onClick={handleLogout} className="dropdown-logout">Logout</button>
        </div>
      )}
    </div>
  );
}
