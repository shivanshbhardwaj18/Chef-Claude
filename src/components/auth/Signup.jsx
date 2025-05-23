import React, { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Toast from "../Toast.jsx";
import "./Signup.css"; // Similar styling to login

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setToastMsg(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setToastType("success");
      setToastMsg("Account created! You can now log in.");
      setEmail("");
      setPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setToastType("error");
      setToastMsg("Signup failed: " + err.message);
    }
  }

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
        <h2>Join us</h2>
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
            minLength={6}
          />
          <button type="submit">Sign Up</button>
        </div>
        <p className="login-prompt">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="login-link">
            Log in
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
