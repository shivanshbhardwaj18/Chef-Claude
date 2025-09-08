import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth"; 
import { useNavigate } from "react-router-dom";
import SavedRecipes from "./SavedRecipes"; 
import "./UserProfile.css";

const UserProfile = () => {
  const { user: authUser, token, setUser } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] = useState(
    window.location.hash.replace("#", "") || "profile"
  );

  // Fetch user info from backend
  useEffect(() => {
    async function fetchUser() {
      if (!token) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.user) {
          setDisplayName(data.user.display_name || "");
          setAvatarUrl(data.user.avatar_url || "");
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
    fetchUser();
  }, [token, setUser]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveSection(window.location.hash.replace("#", "") || "profile");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (!authUser) return <p>Loading...</p>;

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ display_name: displayName, avatar_url: avatarUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
        setUser(data.user);
      } else {
        setError(data.error || "Failed to update profile.");
      }
    } catch (err) {
      setError("An error occurred while updating profile.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    clearMessages();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Password updated successfully!");
        setNewPassword("");
      } else {
        setError(data.error || "Failed to update password.");
      }
    } catch (err) {
      setError("An error occurred while updating password.");
    }
  };

  const handleDeleteAccount = async () => {
    clearMessages();
    if (
      window.confirm(
        "Are you sure you want to permanently delete your account? This cannot be undone."
      )
    ) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/delete`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          navigate("/signup");
        } else {
          const data = await res.json();
          setError(data.error || "Failed to delete account.");
        }
      } catch (err) {
        setError("An error occurred while deleting account.");
      }
    }
  };

  return (
    <div className="profile-page-container">
      <header className="profile-header">
        <h1>Account Settings</h1>
        <p>Manage your account details and preferences.</p>
      </header>

      <div className="profile-content-area">
        <aside className="profile-sidebar">
          <nav>
            <a href="#profile" className={activeSection === "profile" ? "active" : ""}>Profile</a>
            <a href="#security" className={activeSection === "security" ? "active" : ""}>Security</a>
            <a href="#saved-recipes" className={activeSection === "saved-recipes" ? "active" : ""}>Saved Recipes</a>
          </nav>
        </aside>

        <main className="profile-main">
          {activeSection === "profile" && (
            <section id="profile" className="profile-section">
              <div className="section-header">
                <h3>Profile</h3>
                <p>This information will be displayed publicly.</p>
              </div>
              <form onSubmit={handleProfileUpdate} className="section-form">
                <div className="form-group">
                  <label htmlFor="displayName">Display Name</label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <p className="email-display">{authUser.email}</p>
                </div>
                <div className="form-group avatar-group">
                  <label>Avatar</label>
                  <div className="avatar-input-row">
                    <img
                      src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${authUser.email}&size=96`}
                      alt="avatar"
                      className="profile-avatar-preview"
                    />
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/image.png"
                    />
                  </div>
                </div>
                <div className="section-footer">
                  <button type="submit" className="primary-button">Save Changes</button>
                </div>
              </form>
            </section>
          )}

          {activeSection === "security" && (
            <section id="security" className="profile-section">
              <div className="section-header">
                <h3>Password</h3>
                <p>Update your password here.</p>
              </div>
              <form onSubmit={handlePasswordChange} className="section-form">
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="section-footer">
                  <button type="submit" className="primary-button">Update Password</button>
                </div>
              </form>
            </section>
          )}

          {activeSection === "saved-recipes" && (
            <section id="saved-recipes" className="profile-section">
              <div className="section-header">
                <h3>Saved Recipes</h3>
                <p>Your personal recipe collection.</p>
              </div>
              <SavedRecipes />
            </section>
          )}

          <section className="profile-section danger-zone">
            <div className="section-header">
              <h3>Danger Zone</h3>
              <p>Irreversible and destructive actions.</p>
            </div>
            <div className="section-form">
              <div className="danger-action">
                <div>
                  <strong>Delete Account</strong>
                  <p>Permanently remove your account and all of its contents.</p>
                </div>
                <button onClick={handleDeleteAccount} className="danger-button">Delete Account</button>
              </div>
            </div>
          </section>

          {message && <div className="feedback-message success">{message}</div>}
          {error && <div className="feedback-message error">{error}</div>}
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
