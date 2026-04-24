import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import { useAuth } from "../auth/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      if (!res?.access_token) {
        setError(res?.detail || "Invalid login");
        return;
      }

      const token = res.access_token;
      const payload = JSON.parse(atob(token.split(".")[1]));

      login({
        access_token: token,
        role: payload.role,
        email: payload.email
      });

      if (payload.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/patient");
      }
    } catch (err) {
      const message =
        err?.detail?.[0]?.msg ||
        err?.detail ||
        "Login failed. Check email/password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h2>Welcome back</h2>
        <p>Sign in to continue to your heart disease prediction dashboard.</p>

        <div className="form-stack">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          <div className="auth-actions">
            <button onClick={handleLogin} disabled={loading} className="button button-primary">
              {loading ? "Logging in..." : "Login"}
            </button>

            <button onClick={() => navigate("/register")} className="button button-secondary">
              Create Account
            </button>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}
      </section>
    </main>
  );
}
