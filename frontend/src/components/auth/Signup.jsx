import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { Button } from "@primer/react";
import "./auth.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("http://3.107.97.4:3002/signup", {
        email,
        password,
        username,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Signup Failed!");
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
          <h1>Create your account</h1>
          <p>Get started with your GitVault account.</p>
        </div>

        <form className="login-box" onSubmit={handleSignup}>
          <div className="login-field">
            <label className="label" htmlFor="Username">
              Username
            </label>
            <input
              autoComplete="username"
              name="Username"
              id="Username"
              className="input"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

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
            <label className="label" htmlFor="Password">
              Password
            </label>
            <input
              autoComplete="new-password"
              name="Password"
              id="Password"
              className="input"
              type="password"
              placeholder="Create a password"
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
            {loading ? "Creating account..." : "Create account"}
          </Button>

          <p className="login-security-note">
            Your account, your repositories.
          </p>
        </form>

        <div className="pass-box">
          <p>
            Already have an account? <Link to="/auth">Sign in</Link>
          </p>
        </div>

        <p className="login-footer">GitVault · Your code, organized.</p>
      </div>
    </div>
  );
};

export default Signup;
