import { Link, NavLink } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <nav className="navbar">

      <Link to="/" className="navbar-brand">
        <img src={logo} alt="GitVaultGit Logo" />
        <span>GitVault</span>
      </Link>


      <div className="navbar-links">
        <NavLink
          to="/create"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <span>+</span> Create Repository
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Profile
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
