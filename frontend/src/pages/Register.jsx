import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient"
  });

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const registerData = {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role
      };
      const res = await registerUser(registerData);

      if (res.detail) {
        alert(res.detail);
        return;
      }

      alert("Account created!");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Error connecting to server");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h2>Create account</h2>
        <p>Register as a patient or doctor to access the correct dashboard.</p>

        <form className="form-stack" onSubmit={handleRegister}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className="input"
              placeholder="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              className="input"
              placeholder="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              className="input"
              type="password"
              placeholder="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password"
              className="input"
              type="password"
              placeholder="confirm password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              className="select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <div className="auth-actions">
            <button type="submit" className="button button-primary">
              Register
            </button>

            <button type="button" onClick={() => navigate("/login")} className="button button-secondary">
              Back to Login
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
