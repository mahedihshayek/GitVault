import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";

import { Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3002/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Login Failed!");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="GitVault Logo" />
        <span className="login-brand-name">GitVault</span>
      </div>

      <div className="login-content">
        <div className="login-heading">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your GitVault account.</p>
        </div>

        <form className="login-box" onSubmit={handleLogin}>
          <div className="login-field">
            <label className="label" htmlFor="Email">
              Email address
            </label>

            <input
              autoComplete="email"
              name="Email"
              id="Email"
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <div className="password-label-row">
              <label className="label" htmlFor="Password">
                Password
              </label>
            </div>

            <input
              autoComplete="current-password"
              name="Password"
              id="Password"
              className="input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>

          <p className="login-security-note">
            Secure access to your repositories
          </p>
        </form>

        <div className="pass-box">
          <p>
            New to GitVault? <Link to="/signup">Create an account</Link>
          </p>
        </div>

        <p className="login-footer">GitVault · Your code, organized.</p>
      </div>
    </div>
  );
};

export default Login;
