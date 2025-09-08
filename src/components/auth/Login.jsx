import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../Toast.jsx";
import { useAuth } from "../../context/useAuth"; 
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();
  const { login } = useAuth(); 

  async function handleLogin(e) {
    e.preventDefault();
    setToastMsg(null);

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      login(data.user, data.token);

      setToastType("success");
      setToastMsg("Logged in successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setToastType("error");
      setToastMsg(err.message);
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
            <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />
          </div>
        )}
      </form>
    </div>
  );
}
