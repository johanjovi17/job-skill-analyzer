import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import "../styles/navbar.css";
import toast from "react-hot-toast";

function Navbar({ user }) {
  return (
    <nav className="navbar">
      <div className="logo">JobApp</div>

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          All Jobs
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Create Job
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

      <div className="user-info">
        <button
          onClick={() => {
            signOut(auth);
            toast.success("Logged out");
          }}
          className="btn delete-btn"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
