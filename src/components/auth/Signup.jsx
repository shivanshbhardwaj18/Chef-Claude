import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../Toast.jsx";
import { useAuth } from "../../context/useAuth"; 
import "./Signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();
  const { login } = useAuth(); 

  async function handleSignup(e) {
    e.preventDefault();
    setToastMsg(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      // Use context login
      login(data.user, data.token);

      setToastType("success");
      setToastMsg("Account created! You are now logged in.");
      setEmail("");
      setPassword("");
      setName("");

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setToastType("error");
      setToastMsg(err.message);
    }
  }

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
        <h2>Join us</h2>
        <div className="form-body">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
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
            <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
          </div>
        )}
      </form>
    </div>
  );
}
