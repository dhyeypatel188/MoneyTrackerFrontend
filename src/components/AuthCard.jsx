import { useState } from "react";
import { login, register, setToken, getMe } from "../api/client";

export default function AuthCard({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        // Register first
        await register(username.trim(), password);
        // Then auto-login
        const loginRes = await login(username.trim(), password);
        setToken(loginRes.data.access_token);
        const meRes = await getMe();
        onAuthSuccess(meRes.data);
      } else {
        // Login directly
        const res = await login(username.trim(), password);
        setToken(res.data.access_token);
        const meRes = await getMe();
        onAuthSuccess(meRes.data);
      }
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        (Array.isArray(err.response?.data)
          ? err.response.data[0]?.msg
          : "Authentication failed. Please check your credentials.");
      setError(typeof detail === "string" ? detail : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const DEMO_USER = {
    email: "demo@example.com",
    password: "password123",
  };

  const handleFillDemoCredentials = () => {
    setIsRegister(false);
    setUsername(DEMO_USER.email);
    setPassword(DEMO_USER.password);
    setError("");
    setSuccessMsg("Demo credentials loaded (demo@example.com)!");
  };

  const switchMode = (mode) => {
    setIsRegister(mode);
    setError("");
    setSuccessMsg("");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">💸</div>
          <h2>Welcome to Spend Tracker</h2>
          <p className="auth-sub">
            {isRegister
              ? "Create your account to start tracking expenses"
              : "Sign in with your credentials to access your tracker"}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${!isRegister ? "active" : ""}`}
            onClick={() => switchMode(false)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegister ? "active" : ""}`}
            onClick={() => switchMode(true)}
          >
            Create Account
          </button>
        </div>

        <div className="demo-credentials-card">
          <div className="demo-credentials-info">
            <span className="demo-credentials-badge">⚡ Demo Account</span>
            <span className="demo-credentials-hint">
              <span>{DEMO_USER.email}</span> • <span>{DEMO_USER.password}</span>
            </span>
          </div>
          <button
            type="button"
            id="fill-demo-credentials-btn"
            className="btn-demo-fill"
            onClick={handleFillDemoCredentials}
            title="Directly fill email and password into login fields"
          >
            ⚡ Fill Demo Credentials
          </button>
        </div>

        {error && <div className="form-error auth-alert">{error}</div>}
        {successMsg && <div className="auth-success auth-alert">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="auth-username">Username or Email</label>
            <input
              id="auth-username"
              type="text"
              placeholder="e.g. demo@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="auth-password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
              />
              <button
                type="button"
                id="toggle-password-btn"
                className="btn-toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
                <span className="toggle-password-text">{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create Account & Sign In" : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            🔒 Secured with JWT & bcrypt password hashing
          </p>
        </div>
      </div>
    </div>
  );
}
