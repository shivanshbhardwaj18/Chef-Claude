import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Toast from "../Toast.jsx";
import "./Login.css"; // Import the new CSS file

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setToastMsg(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setToastType("success");
      setToastMsg("Logged in successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      setToastType("error");
      setToastMsg("Invalid credentials. Please try again.");
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Welcome back</h2>
        <div className="form-body">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
        </div>
        <p className="signup-prompt">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/signup")} className="signup-link">
        Sign up
        </span>
        </p>
        {toastMsg && (
          <div className="toast-wrapper">
            <Toast
              message={toastMsg}
              type={toastType}
              onClose={() => setToastMsg(null)}
            />
          </div>
        )}
      </form>
    </div>
  );
}
