import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api.js";
import { setToken } from "../lib/auth.js";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("cassy@example.com");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      setToken(data.token);
      nav("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h1>Login</h1>
      <p className="muted">Use demo: cassy@example.com / Password123!</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={onSubmit} className="form">
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>

      <p className="muted">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
