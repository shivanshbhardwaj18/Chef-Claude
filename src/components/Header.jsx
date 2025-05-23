import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Header() {
  const { user } = useAuth();

  async function handleLogout() {
    try {
      await signOut(auth);
      // Optionally, you can redirect after logout or show a message
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <header className="Header">
      <img className="Headerimg" src="./chef-icon.png" alt="Chef Icon" />
      <h1 className="HeaderText">Chef Claude</h1>

      <nav className="log-sign">
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
