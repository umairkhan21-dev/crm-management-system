import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.remove("dark");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);

      if (res.data.user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/tickets");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">CRM Login</h1>
        <p className="login-subtitle">Access your dashboard</p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="name@company.com" value={form.email} onChange={handleChange} required/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required/>
          </div>

          <button type="submit" className="login-btn">
            Sign in
          </button>
        </form>

        <p className="login-footer">
          © 2025 CRM System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
